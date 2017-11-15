'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const marked = require('marked')

module.exports = function (rawPagePath, options) {
  var pagePath = path.resolve(rawPagePath)
  return parsePath(pagePath, options || {})
}

function parsePath (pagePath, options) {
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
    } else {
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
      return parsePath(path.join(dirPath, fileName))
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
  const meta = text.substring(0, split)
  const body = text.substring(split)
  return {
    body: body.trim(),
    html: marked(body).trim(),
    meta: yaml.load(meta)
  }
}
