import PocketBase from 'pocketbase';

const pbUrl = 'https://pocketbase-production-4ff4.up.railway.app/';

export const pb = new PocketBase(pbUrl);

export function getFileUrl(collection, recordId, filename) {
    return pbUrl + '/api/files/' + collection + '/' + recordId + '/' + filename;
}
