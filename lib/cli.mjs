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
    // console.log(items.map((r) => r.title));
    // console.log(items.length);

    for (const item of items) {
        // const itemId = uuidv5(item.link, '6ba7b811-9dad-11d1-80b4-00c04fd430c8');
        const cleanName = item.title.replace(/[^a-z0-9]+|\s+/gmi, " ");
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
            // content: article.content,
        }, {
            // disableJavascript: true,
            // timeout: 120000,
            // preferCSSPageSize: true,
            // width: '1404px',
            // height: '1872px',
            width: '157.2mm',
            height: '209.6mm',
        });
        // await fs.writeFile(`./${item.title}.pdf`, pdfBuffer);

        await remarkable.uploadPdf({
            title: cleanName,
            pdfBuffer,
        });
        logger.info(`[${cleanName}]: uploaded to remarkable`);



        // // files.push({
        // //     url: item.link,
        // //     name: `${itemId}.pdf`,
        // // })
        // console.log('yee haw');

        // await fs.writeFile(`./${itemId}.pdf`, pdfBuffer);

    }

    // const results = await html_to_pdf.generatePdfs(files, { format: 'A4' });
    // console.log('generated');
}

run();