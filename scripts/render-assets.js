'use strict';
import path from 'path';
import sh from 'shelljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function renderAssets() {
    const sourcePath = path.resolve(__dirname, '../src/assets');
    const destPath = path.resolve(__dirname, '../dist/.');

    if (sh.test('-d', sourcePath)) {
        sh.cp('-R', sourcePath, destPath);
    }

    const rootFiles = [
        path.resolve(__dirname, '../src/site.webmanifest'),
        path.resolve(__dirname, '../src/browserconfig.xml'),
    ];

    rootFiles.forEach(file => {
        if (sh.test('-f', file)) {
            sh.cp(file, destPath);
        }
    });

    const bootstrapIconsPath = path.resolve(__dirname, '../node_modules/bootstrap-icons/font/*');
    const destFontsPath = path.resolve(__dirname, '../dist/css/font');

    sh.mkdir('-p', destFontsPath);
    sh.cp('-R', bootstrapIconsPath, destFontsPath);
};
