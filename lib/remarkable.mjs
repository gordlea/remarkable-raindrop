import rt from 'remarkable-typescript';
import { v1 as uuidv1 } from 'uuid';
import cfg from './config.mjs';
import RemarkableItems from './model/RemarkableItems.mjs';

const { Remarkable } = rt;
const client = new Remarkable({ deviceToken: cfg.remarkableDeviceToken });

const rmkDir = cfg.remarkableDirectory;
let targetDir = null;
let remarkableItems = null;

async function init() {
    await client.refreshToken();
    await refreshItems();
    await ensureDirectoryExists();
}



async function uploadPdf({ title, pdfBuffer }) {

    // console.log(`uploading ${title}`);
    await client.uploadPDF(title, uuidv1(), pdfBuffer, targetDir.id);
}

async function refreshItems() {
    const rawItems = await client.getAllItems();
    remarkableItems = new RemarkableItems(rawItems);
}

async function ensureDirectoryExists() {
    targetDir = remarkableItems.findDir(rmkDir, '');
    if (!targetDir) {
        await client.createDirectory(rmkDir, uuidv1());
        await refreshItems();
        targetDir = remarkableItems.findDir(rmkDir, '');
        return;
    }
}

function documentExists(name) {
    return remarkableItems.findDocument(name, targetDir.id) !== null;
}

export default {
    init,
    refreshItems,
    documentExists,
    uploadPdf,
}