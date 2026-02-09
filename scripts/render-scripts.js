'use strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function renderScripts() {
    const sourcePath = path.resolve(__dirname, '../src/js');
    const destJSPath = path.resolve(__dirname, '../dist/js');

    if (!fs.existsSync(destJSPath)) {
        fs.mkdirSync(destJSPath, { recursive: true });
    }

    fs.cpSync(sourcePath, destJSPath, { recursive: true });

    const bootstrapJS = path.resolve(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
    const bootstrapJSMap = path.resolve(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map');

    fs.copyFileSync(bootstrapJS, path.join(destJSPath, 'bootstrap.bundle.min.js'));
    fs.copyFileSync(bootstrapJSMap, path.join(destJSPath, 'bootstrap.bundle.min.js.map'));
};
