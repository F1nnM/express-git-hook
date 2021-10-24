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

const multihook = function (clonePaths, cloneOptions) {

  return function (req, res, next = () => { }) {

    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function (chunk) {
      req.rawBody += chunk;
    });
    req.on('end', async function () {
      // all data received

      // decode string
      req.body = decodeURIComponent(req.rawBody.substring(8, req.rawBody.length));
      
      var data = JSON.parse(req.body);

      // event received for a different repo then specified 
      if (!Object.keys(clonePaths).includes(data.repository.full_name))
        res.status(403).end();

      var clonePath = clonePaths[data.repository.full_name];

      del.sync([clonePath+"/**", "!"+clonePath])

      await clone("https://github.com/" + data.repository.full_name, clonePath, cloneOptions);

      res.locals.files = buildFileTree(clonePath);

      next();

    });
  }
}

module.exports = {
  multihook,
  hook: function (repository, clonePath, options) {
    return multihook({ [repository]: clonePath }, options);
  }
}