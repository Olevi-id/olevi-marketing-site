'use strict';
import path from 'path';
import fs from 'fs';
import renderPug from './render-pug.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.resolve(__dirname, '../src');

const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });

    return arrayOfFiles;
};

getAllFiles(srcPath).forEach(_processFile);

function _processFile(filePath) {
    if (
        filePath.match(/\.pug$/)
        && !filePath.match(/include/)
        && !filePath.match(/mixin/)
        && !filePath.match(/\/pug\/layouts\//)
    ) {
        renderPug(filePath);
    }
}
