'use strict';

const clone = require('git-clone/promise');
const fs = require('fs');
const path = require('path')

function buildFileTree(rootDir) {
    var dir = {};
    fs.readdirSync(rootDir).forEach(file => {
        if (file == ".git")
            return;
        let filePath = path.resolve(rootDir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            dir[file] = buildFileTree(filePath);
        } else {
            dir[file] = filePath;
        }
    });
    return dir;
}

function rmdir(dir) {
    var list = fs.readdirSync(dir);
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if (filename == "." || filename == "..") {
            // pass these files
        } else if (stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

const multihook = function (clonePaths, cloneOptions) {

    return async function (req, res, next = () => { }) {
        var data = JSON.parse(req.body);

        // event received for a different repo then specified 
        if (!Object.keys(clonePaths).includes(data.repository.url))
            res.status(403).end();

        var clonePath = clonePaths[data.repository.url];

        if (fs.existsSync(clonePath)) {
            fs.rmdirSync(clonePath, { recursive: true })
        }

        await clone(data.repository.url, clonePath, cloneOptions);

        res.locals.files = buildFileTree(clonePath);

        next();
    }
}

module.exports = {
    multihook,
    hook: function(repository, clonePath, options) {
        return multihook({[repository]: clonePath}, options);
    }
}