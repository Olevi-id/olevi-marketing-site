'use strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function renderScripts() {
    const sourcePath = path.resolve(__dirname, '../src/js');
    const destPath = path.resolve(__dirname, '../dist');

    fs.cpSync(sourcePath, destPath, { recursive: true });

    const bootstrapJS = path.resolve(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
    const bootstrapJSMap = path.resolve(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map');
    const destJSPath = path.resolve(__dirname, '../dist/js');

    if (!fs.existsSync(destJSPath)) {
        fs.mkdirSync(destJSPath, { recursive: true });
    }

    fs.copyFileSync(bootstrapJS, path.join(destJSPath, 'bootstrap.bundle.min.js'));
    fs.copyFileSync(bootstrapJSMap, path.join(destJSPath, 'bootstrap.bundle.min.js.map'));
};
