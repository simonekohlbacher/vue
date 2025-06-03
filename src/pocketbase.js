import PocketBase from 'pocketbase';

const pbUrl = 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

export function getFileUrl(collection, recordId, filename) {
    return pbUrl + '/api/files/' + collection + '/' + recordId + '/' + filename;
}
