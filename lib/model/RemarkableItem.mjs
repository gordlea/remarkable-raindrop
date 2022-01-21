export default class RemarkableItem {
    name = null;
    id = null;
    type = null;
    parentId = null;

    constructor(rawItem) {
        this.name = rawItem.VissibleName;
        this.id = rawItem.ID;
        this.type = rawItem.Type === 'CollectionType' ? 'dir' : 'doc';
        this.parentId = rawItem.Parent;
    }
}