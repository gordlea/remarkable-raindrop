import lumbermill from '@lumbermill/node';
import html_pdf_node from 'html-pdf-node';
import cfg from './config.mjs';
import Raindrop from './raindrop.mjs';
import { LOG_PREFIX } from './constants.mjs';
import remarkable from './remarkable.mjs';

const logger = lumbermill(`${LOG_PREFIX}:cli`);

async function run() {
    const raindrop = new Raindrop({
        testToken: cfg.raindropTestToken,
    });

    await remarkable.init();

    const items = await raindrop.getDrops(cfg.raindropSearch);
    logger.log(`found ${items.length} items that match search \`${cfg.raindropSearch}\``);
    const itemNames = [];
    for (const item of items) {
        const cleanName = item.title.replace(/[^a-z0-9]+|\s+/gmi, " ");
        itemNames.push(cleanName);
        logger.debug(`[${cleanName}]: processing`);

        // check if item already exists on remarkable
        const exists = remarkable.documentExists(cleanName);

        if (exists) {
            logger.debug(`[${cleanName}] already exists on remarkable, skipping`);
            continue;
        }
        logger.info(`[${cleanName}]: generating pdf`);

        const url = item.link.indexOf('outline.com') === -1 ? `http://outline.com/${item.link}` : item.link;

        const pdfBuffer = await html_pdf_node.generatePdf({ 
            url
        }, {
            width: '157.2mm',
            height: '209.6mm',
        });

        await remarkable.uploadPdf({
            title: cleanName,
            pdfBuffer,
        });
        logger.info(`[${cleanName}]: uploaded to remarkable`);
    }
    await remarkable.deleteRemovedRaindropItems(itemNames);
}

run();