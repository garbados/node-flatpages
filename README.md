# flatpages

[![Build Status](https://travis-ci.org/garbados/node-flatpages.svg?branch=master)](https://travis-ci.org/garbados/node-flatpages)
[![Coverage Status](https://coveralls.io/repos/github/garbados/node-flatpages/badge.svg?branch=master)](https://coveralls.io/github/garbados/node-flatpages?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[markdown]: https://daringfireball.net/projects/markdown/
[marked]: https://github.com/chjj/marked
[yaml]: http://www.yaml.org/
[js-yaml]: https://github.com/nodeca/js-yaml

Like [Flask-FlatPages](http://pythonhosted.org/Flask-FlatPages/) but in javascript. It's useful for annotating markdown files with some basic metadata.

Flatpages parses markdown files by splitting it at the first empty line (or a custom string) and interpreting the first section as [YAML][yaml] using [js-yaml][js-yaml], and the second as [Markdown][markdown] using [Marked][marked]. When given a directory, flatpages traverses it and parses each file it finds that matches its sought extension (`.md` and `.markdown` by default). Once it's done, it returns a Promise that resolves to the meta data, html text, and raw text of each parsed file.

For example, consider this markdown file:

*cats-on-roombas.md*

```
tags:
  - cats
  - roombas
  - cats on roombas

# Cats on Roombas

Cats are sometimes known to sit atop household automotons like the "Roomba" vacuum cleaner, appearing to ride it. Between 2010 and 2012 media depicting cats on roombas garnered tens of millions of views on YouTube alone, becoming a memetic phenomenon. While such media is still produced, the novelty has waned over time as advanced household automotons have become more common.
```

You can use flatpages to read such annotated markdown files like this:

```
const flatpages = require('flatpages')

flatpages('./cats-on-roombas.md').then((result) {
  console.log(result)
  // {
  //   meta: {
  //     tags: ['cats', 'roombas', 'cats on roombas']
  //   },
  //   body: '# Cats on Roombas\n\Cats are sometimes known to...',
  //   html: '<h1>Cats on Roombas</h1>...'
  // }
  })
```

**Note:** Flatpages breaks pages at the first empty line (or a specified string) and assume that everything above it is YAML while everything below it is Markdown. If you want no YAML on your page, make its first line blank (or otherwise make sure it matches the split string you specify).

## Installation

Install with [npm](https://www.npmjs.com/):

`npm install flatpages`

## Usage

### async `flatpages(string fileOrDirPath = '.', object options = {})`

`options`:
- `split`: A string used to identify where to separate the YAML portion of the document from the Markdown portion.
- `extension`: A regex describing what file extensions to accept. By default, flatpages accepts any file that ends in `.md` or `.markdown`.

Returns a promise that resolves to the parsed contents of each file found:

- `meta`: An object describing the metadata parsed from the file's YAML.
- `html`: The HTML compiled from the file's markdown.
- `body`: The file's raw markdown.

Given a file, the promise resolves to an object like this:

```
{
  meta: {
    tags: ['cats', 'roombas', 'cats on roombas']
  },
  body: '# Cats on Roombas\n\Cats are sometimes known to...',
  html: '<h1>Cats on Roombas</h1>...'
}
```

Given a directory, the promise resolves to an object reflecting the traversed directory structure, like this:

```
{
  'entry.md': {
    meta: {
      title: 'Hello, world!'
    },
    body: '# Greetings!',
    html: '<h1>Greetings!</h1>'
  },
  drafts: {
    'feelings.md': {
      meta: {
        title: 'A Case of the Feels'
      },
      body: 'Sad :( _but_ doing my **best**!',
      html: '<p>Sad :( <em>but</em> doing my <strong>best</strong>!</p>'
    }
  }
}
```

## Tests

`npm test`
