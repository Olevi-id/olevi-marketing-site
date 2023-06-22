'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderAssets() {
    let sourcePath = upath.resolve(upath.dirname(__filename), '../src/assets');
    let destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    
    sh.cp('-R', sourcePath, destPath)
    sh.cp(sourcePath + '/favicon.ico', './dist/');

    sourcePath = upath.resolve(upath.dirname(__filename), '../src/font');
    destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    sh.cp('-R', sourcePath, destPath)

    sourcePath = upath.resolve(upath.dirname(__filename), '../src/Olevi-License-Terms.md');
    destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    sh.cp(sourcePath, destPath)
};