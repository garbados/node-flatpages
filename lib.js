'use strict'

const { promisify } = require('util')
const fs = require('fs')
const marked = require('marked')
const path = require('path')
const yaml = require('js-yaml')

const fsReaddir = promisify(fs.readdir)
const fsReadFile = promisify(fs.readFile)
const fsStat = promisify(fs.stat)

// default value to separate the yaml and markdown
// sections of a document
const SPLIT = '\n\n'

// regex to check that a file has a non-zero name
// that ends in .md or .markdown
const EXTENSION = /.{1,}(\.md|\.markdown)$/

module.exports = function (rawPagePath = '.', options = {}) {
  const pagePath = path.resolve(rawPagePath)
  return parsePath(pagePath, options || {})
}

async function parsePath (pagePath = '.', options = {}) {
  options.split = options.split || SPLIT
  options.extension = options.extension || EXTENSION
  const stat = await fsStat(path.resolve(pagePath))
  if (stat.isDirectory()) {
    return parseDir(pagePath, options)
  } else if (pagePath.search(options.extension) === 0) {
    return parseFile(pagePath, options)
  }
}

async function parseDir (dirPath, options) {
  const files = await fsReaddir(dirPath, options)
  const pages = {}
  for (const fileName of files) {
    const result = await parsePath(path.join(dirPath, fileName), options)
    if (!result) { continue }
    pages[fileName] = result
  }
  return pages
}

async function parseFile (filePath, options) {
  const data = await fsReadFile(filePath, options)
  return parseText(data.toString(), options)
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
