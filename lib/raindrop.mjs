import lumbermill from '@lumbermill/node';
import got from 'got';
import { LOG_PREFIX } from './constants.mjs';

const logger = lumbermill(`${LOG_PREFIX}:raindrop`);

const g = got.extend({
    prefixUrl: 'https://api.raindrop.io/rest/v1',
    headers: {
        'Content-Type': 'application/json; charset=UTF8',
        'X-Accept': 'application/json',
    }
})

const perpage = 50;

export default class Raindrop {
    #accessToken = null;

    constructor({
        testToken,
    }) {
        if (testToken) {
            this.#accessToken = testToken;
        }
    }

    async getDrops(search = '', collection = 0) {
        logger.debug(`getDrops(search:${search}, collection:${collection})`);
        const items = [];

        const getPage = async (pageNum) => {
            logger.debug(`loading page ${pageNum}. max items per page: ${perpage}`)
            const response = await g.get(`raindrops/${collection}`, {
                searchParams: {
                    search,
                    perpage,
                    page: pageNum,
                },
                headers: {
                    'Authorization': `Bearer ${this.#accessToken}`,
                },
            });
            const { statusCode, body, statusMessage }  = response;
            if (statusCode !== 200) {
                logger.error('error trying to load items from raindrop.io', statusCode, statusMessage, err);
                return null;
            }
            return JSON.parse(body)
        }

        const firstPage = await getPage(0);
        if (firstPage === null) {
            return [];
        }

        const totalCount = firstPage.count;
        for (const item of firstPage.items) {
            items.push(item);
        }
        let currentPage = 1;
        while(items.length < totalCount) {
            const page = await getPage(currentPage);
            if (page === null) {
                break;
            }

            for (const item of page.items) {
                items.push(item);
            }
            currentPage += 1;
        }


        return items;
    }
}