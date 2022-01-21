// import Raindrop from '../raindrop.mjs';
import RemarkableItem from './RemarkableItem.mjs';

export default class RemarkableItems {
    items = new Map();

    constructor(rawItems = []) {
        for (const rawItem of rawItems) {
            const item = new RemarkableItem(rawItem);
            this.items.set(item.id, item);
        }
    }

    findDir(name, parentId) {
        return this.findItem(name, 'dir', parentId);
        // const values = this.items.values();
        // for (const item of values) {
        //     if (item.isDir && item.name === name) {
        //         return item;
        //     }
        // }
        // return null;
    }

    findDocument(name, parentId) {
        return this.findItem(name, 'doc', parentId);

        // const entries = this.items.entries();
        // for (const doc of entries) {
        //     if (doc.isDoc && doc.name === name) {
        //         return doc;
        //     }
        // }
        // return null;
    }

    findItem(name, type, parentId) {
        const entries = this.items.values();
        for (const item of entries) {
            const rightType = type !== undefined && type !== null ? item.type === type : true;
            if (!rightType) {
                continue;
            }
            const parentCorrect = parentId !== undefined && parentId !== null ? item.parentId === parentId : true;
            if (!parentCorrect) {
                continue;
            }
            const nameCorrect = item.name === name;
            if (!nameCorrect) {
                continue;
            }
            return item;
        }
        return null;
    }
    
}