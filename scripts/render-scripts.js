'use strict';
import path from 'path';
import sh from 'shelljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function renderScripts() {
    const sourcePath = path.resolve(__dirname, '../src/js');
    const destPath = path.resolve(__dirname, '../dist/.');

    sh.cp('-R', sourcePath, destPath);

    const bootstrapJS = path.resolve(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
    const bootstrapJSMap = path.resolve(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map');
    const destJSPath = path.resolve(__dirname, '../dist/js');

    sh.cp(bootstrapJS, destJSPath);
    sh.cp(bootstrapJSMap, destJSPath);
};
