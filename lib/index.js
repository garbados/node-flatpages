'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const marked = require('marked')

// default value to separate the yaml and markdown
// sections of a document
const SPLIT = '\n\n'
// regex to check that a file has a non-zero name
// that ends in .md or .markdown
const EXTENSION = /.{1,}(\.md|\.markdown)$/

module.exports = function (rawPagePath = '.', options = {}) {
  var pagePath = path.resolve(rawPagePath)
  return parsePath(pagePath, options || {})
}

function parsePath (pagePath = '.', options = {}) {
  options.split = options.split || SPLIT
  options.extension = options.extension || EXTENSION
  return new Promise((resolve, reject) => {
    fs.stat(path.resolve(pagePath), (err, stat) => {
      if (err) {
        reject(err)
      } else {
        resolve(stat)
      }
    })
  }).then((stat) => {
    if (stat.isDirectory()) {
      return parseDir(pagePath, options)
    } else if (pagePath.search(options.extension) === 0) {
      return parseFile(pagePath, options)
    }
  })
}

function parseDir (dirPath, options) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, options, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  }).then((files) => {
    const promises = files.map((fileName) => {
      return parsePath(path.join(dirPath, fileName), options)
    })
    return Promise.all(promises).then((results) => {
      var pages = {}
      files.forEach((fileName, i) => {
        pages[fileName] = results[i]
      })
      return pages
    })
  })
}

function parseFile (filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }).then((data) => {
    if (typeof data !== 'string') {
      return parseText(data.toString(), options)
    } else {
      return parseText(data, options)
    }
  })
}

function parseText (rawText, options) {
  const text = rawText.replace(/(\r\n|\n|\r)/gm, '\n')
  const split = text.indexOf(options.split || '\n\n')
  var meta
  var body
  if (split >= 0) {
    meta = yaml.load(text.substring(0, split))
    body = text.substring(split)
  } else {
    meta = undefined
    body = text
  }
  return {
    body: body.trim(),
    html: marked(body).trim(),
    meta: meta
  }
}
