express-git-hook
=========

A lightweight module for handling Github webhooks compatible with express and the default http server.

## Installation
```
$ npm install @f1nnm/express-git-hook`
```

```
const hook = require('express-git-hook');
```

## API
### `hook(repo, targetPath, [options])`
 * `repo` : URL of the repository to watch
 * `targetPath` : Path to a directory to clone into. Will be created, if it doesn't exist.
 * `options`: Optional. [Options for git-clone](https://www.npmjs.com/package/git-clone#common-options)
# Usage

```
var express = require('express');
var app = express();

const hook = require('express-git-hook');
// URL of the repo, directory to clone into, [Optional: options for cloning]
const mw = hook('https://github.com/F1nnM/express-git-hook', "./test");

// for all requests
app.post('/', mw, (req, res) => {
    // res.locals.files contains a list of all files with their full paths
    // if, e.g. you always want to read the file config/main.json, 
    // you can use the following:
    let path = res.locals.files['config']['main.json'];
    fs.readFile(path, 'utf-8', (err, data) => {
        //...
    })
})
```
