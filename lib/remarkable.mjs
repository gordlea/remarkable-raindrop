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
    await client.uploadPDF(title, uuidv1(), pdfBuffer, targetDir.id);
}

async function refreshItems() {
    const rawItems = await client.getAllItems();
    remarkableItems = new RemarkableItems(rawItems);
}

function findRaindropItems() {
    return remarkableItems.getItemsWithParent(targetDir.id);
}

function findRemovedRaindropItems(currentRaindropItemNames = []) {
    const removedItems = new Map();
    for (const tabletItem of findRaindropItems()) {
        removedItems.set(tabletItem.name, tabletItem);
    }

    for (const currentItemName of currentRaindropItemNames) {
        removedItems.delete(currentItemName);
    }

    return Array.from(removedItems.values());
}

async function deleteRemovedRaindropItems(currentRaindropItemNames = []) {
    const removedItems = findRemovedRaindropItems(currentRaindropItemNames);

    for (const item of removedItems) {
        await client.deleteItem(item.id, item.version);
    }
    await refreshItems();
}


async function ensureDirectoryExists() {
    targetDir = remarkableItems.findDirByName(rmkDir, '');
    if (!targetDir) {
        await client.createDirectory(rmkDir, uuidv1());
        await refreshItems();
        targetDir = remarkableItems.findDirByName(rmkDir, '');
        return;
    }
}

function documentExists(name) {
    return remarkableItems.findDocumentByName(name, targetDir.id) !== null;
}

export default {
    init,
    refreshItems,
    documentExists,
    uploadPdf,
    deleteRemovedRaindropItems,
}