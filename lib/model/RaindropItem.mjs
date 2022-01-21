import { v5 as uuidv5 } from 'uuid';

export default class RaindropItem {
    id = null;
    collectionId = null;
    cover = null;
    created = null;
    domain = null;
    excerpt = null;
    important = false;
    lastUpdate = null;
    link = null;
    media = null;
    removed = false;
    sort = null;
    tags = [];
    title = null;
    type = null;

    constructor(rawRaindropItem) {
        this.id = rawRaindropItem._id;
        this.collectionId = rawRaindropItem.collectionId;
        this.cover = rawRaindropItem.cover;
        this.created = rawRaindropItem.created;
        this.domain = rawRaindropItem.domain;
        this.excerpt = rawRaindropItem.excerpt;
        this.important = rawRaindropItem.important;
        this.lastUpdate = rawRaindropItem.lastUpdate;
        this.link = rawRaindropItem.link;
        this.media = rawRaindropItem.media;
        this.removed = rawRaindropItem.removed;
        this.sort = rawRaindropItem.sort;
        this.tags = rawRaindropItem.tags;
        this.title = rawRaindropItem.title;
        this.type = rawRaindropItem.type;

    }


}