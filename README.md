express-git-hook
=========

A lightweight module for handling Github webhooks compatible with express and the default http server.

## Installation
```
$ npm install @f1nnm/express-git-hook`
```

```JavaScript
const { hook, multihook } = require('express-git-hook');
```

## API
### `hook(repo, targetPath, [options])`
 * `repo` : URL of the repository to watch
 * `targetPath` : Path to a directory to clone into. Will be created, if it doesn't exist.
 * `options`: Optional. [Options for git-clone](https://www.npmjs.com/package/git-clone#common-options)

### `multihhook(clonePaths, [options])`
Works like `hook`, but accepts multiple repositories.
 * `clonePaths` : Object like: `{'repositoryURL': './path/to/clone/to', ...}`
 * `options`: Optional. [Options for git-clone](https://www.npmjs.com/package/git-clone#common-options)
# Usage
## Listen for only one repository
```JavaScript
var express = require('express');
var app = express();

const {hook} = require('express-git-hook');
// URL of the repo, directory to clone into, [Optional: options for cloning]
const mw = hook('F1nnM/express-git-hook', "./git-hook");

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
## Listen for multiple repositories
```JavaScript
var express = require('express');
var app = express();

const {multihook} = require('express-git-hook');

// Configuring the allowed repos and their clone paths
const config = {
    'F1nnM/express-git-hook': './repos/git-hook',
    'F1nnM/HyperViz': './repos/hyperviz',
}
// create the middleware
const mw = hook(config);

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