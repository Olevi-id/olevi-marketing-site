'use strict';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import sass from 'sass';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destPath = path.resolve(__dirname, '../dist/css/styles.css');

export default function renderSCSS() {

    const results = sass.compile(path.resolve(__dirname, '../src/scss/styles.scss'), {
        loadPaths: [
            path.resolve(__dirname, '../node_modules')
        ],
    });

    const compiledCss = results.css;

    const destPathDirname = path.dirname(destPath);
    if (!fs.existsSync(destPathDirname)) {
        fs.mkdirSync(destPathDirname, { recursive: true });
    }

    postcss([ autoprefixer ]).process(compiledCss, {from: 'styles.css', to: 'styles.css'}).then(result => {
        result.warnings().forEach(warn => {
            console.warn(warn.toString())
        })
        fs.writeFileSync(destPath, result.css);
    })

};
