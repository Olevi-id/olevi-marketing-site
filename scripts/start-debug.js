import concurrently from 'concurrently';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserSyncPath = path.resolve(__dirname, '../node_modules/.bin/browser-sync');

concurrently([
    { command: 'node --inspect scripts/sb-watch.js', name: 'SB_WATCH', prefixColor: 'bgBlue.bold' },
    {
        command: `${browserSyncPath} dist -w --no-online`,
        name: 'SB_BROWSER_SYNC',
        prefixColor: 'bgBlue.bold',
    }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
}).then(success, failure);

function success() {
    console.log('Success');
}

function failure() {
    console.log('Failure');
}
