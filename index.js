'use strict'

const clone = require('git-clone/promise')
const fs = require('fs')
const path = require('path')
const del = require('del')

function buildFileTree(rootDir) {
  var dir = {}
  fs.readdirSync(rootDir).forEach(file => {
    if (file == ".git")
      return
    let filePath = path.resolve(rootDir, file)
    if (fs.lstatSync(filePath).isDirectory()) {
      dir[file] = buildFileTree(filePath)
    } else {
      dir[file] = filePath
    }
  })
  return dir
}

const multihook = function (clonePaths, cloneOptions, pat) {

  return function (req, res, next = () => { }) {

    req.setEncoding('utf8')
    req.rawBody = ''
    req.on('data', function (chunk) {
      req.rawBody += chunk
    })
    req.on('end', async function () {
      // all data received

      // decode string
      req.body = decodeURIComponent(req.rawBody.substring(8, req.rawBody.length))

      var data = JSON.parse(req.body)

      // event received for a different repo then specified 
      if (!Object.keys(clonePaths).includes(data.repository.full_name))
        res.status(403).end()
      
      let cloneUrl;
      if(pat){
        cloneUrl = `https://user:${pat}@github.com/${data.repository.full_name}`
      }else{
        if(data.repository.private)
          throw new Error("Received hook from private repository, but no PAT was supplied!")
          cloneUrl = `https://github.com/${data.repository.full_name}`
      }

      var clonePath = clonePaths[data.repository.full_name]

      del.sync([clonePath + "/**", clonePath + "/.git", "!" + clonePath])

      await clone(cloneUrl, clonePath, ["--recurse-submodules", "-j8", ...cloneOptions])

      res.locals.files = buildFileTree(clonePath)

      next()

    })
  }
}

module.exports = {
  multihook,
  hook: function (repository, clonePath, options, pat) {
    return multihook({ [repository]: clonePath }, options, pat)
  }
}