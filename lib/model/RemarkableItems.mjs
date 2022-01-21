import RemarkableItem from './RemarkableItem.mjs';

export default class RemarkableItems {
    items = new Map();

    constructor(rawItems = []) {
        for (const rawItem of rawItems) {
            const item = new RemarkableItem(rawItem);
            this.items.set(item.id, item);
        }
    }

    findDirByName(name, parentId) {
        return this.findItemByName(name, 'dir', parentId);
    }

    findDocumentByName(name, parentId) {
        return this.findItemByName(name, 'doc', parentId);
    }

    findItemByName(name, type, parentId) {
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

    getItemsWithParent(parentId) {
        const entries = Array.from(this.items.values());
        return entries.filter((entry) => {
            return entry.parentId === parentId;
        });
    }
}