import PocketBase from 'pocketbase';

const pbUrl = 'https://pocketbase-o45l.onrender.com';

export const pb = new PocketBase(pbUrl);

export function getFileUrl(collection, recordId, filename) {
    return pbUrl + '/api/files/' + collection + '/' + recordId + '/' + filename;
}
