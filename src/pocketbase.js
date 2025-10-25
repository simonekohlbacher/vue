import PocketBase from 'pocketbase';

const pbUrl = 'http://pocketbase-lively-snow-1768.fly.dev';

export const pb = new PocketBase(pbUrl);

export function getFileUrl(collection, recordId, filename) {
    return pbUrl + '/api/files/' + collection + '/' + recordId + '/' + filename;
}
