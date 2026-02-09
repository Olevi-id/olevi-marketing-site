'use strict';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function renderAssets() {
    const sourcePath = path.resolve(__dirname, '../src/assets');
    const destPath = path.resolve(__dirname, '../dist');
    if (existsSync(sourcePath)) {
        await fs.cp(sourcePath, path.join(destPath, 'assets'), { recursive: true });
    }

    const rootFiles = [
        path.resolve(__dirname, '../src/site.webmanifest'),
        path.resolve(__dirname, '../src/browserconfig.xml'),
    ];

    for (const file of rootFiles) {
        if (existsSync(file)) {
            await fs.cp(file, path.resolve(destPath, path.basename(file)));
        }
    }

    const bootstrapIconsPath = path.resolve(__dirname, '../node_modules/bootstrap-icons/font');
    const destFontsPath = path.resolve(__dirname, '../dist/css/font');

    if (existsSync(bootstrapIconsPath)) {
        await fs.mkdir(destFontsPath, { recursive: true });
        await fs.cp(bootstrapIconsPath, destFontsPath, { recursive: true });
    }
};
