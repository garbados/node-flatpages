# flatpages

[![Build Status](https://travis-ci.org/garbados/node-pages.svg?branch=master)](https://travis-ci.org/garbados/node-pages)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Like [Flask-FlatPages](http://pythonhosted.org/Flask-FlatPages/), Node-FlatPages recursively collects text files from a given directory and exposes them as Pages, made up of metadata stored as YAML, and a text body written in Markdown. For example:

```
tags:
	- cats
	- roombas
	- cats on roombas

# Cats on Roombas

Please, partake of them:

* [Attack Roomba](http://www.youtube.com/watch?v=vf9wHkkNGUU)
* [Roomba Driver](http://www.youtube.com/watch?v=LQ-jv8g1YVI)
* [Captain del Roomba](http://www.youtube.com/watch?v=Ep80TSVQe70)
```

Renders:

```
{
	meta: {
		tags: ['cats', 'roombas', 'cats on roombas']
	},
	body: '# Cats on Roombas\n\nPlease, partake of them:\n\n...',
	html: '<h1>Cats on Roombas</h1>...'
}
```

## Installation

Install with [npm](https://www.npmjs.com/):

`npm install flatpages`

## Usage

```js
var flatpages = require('flatpages');

flatpages('PATH/TO/ENTRIES').then((entries) => {
	console.log(entries['hello.md'].body)
	// # Hello, World!
	console.log(entries['hello.md'].html)
	// <h1>Hello, World!</h1>
	})
```

### A note about parsing YAML and Markdown

Flatpages breaks pages at the first empty line, assuming everything above it is YAML, and everything below it is Markdown. So, if you want no YAML on your page, make its first line blank.

## API

### `flatpages(PATH, options)`

Given a path, flatpages finds and parses any files under that path. Flatpages does not currently discriminate by file extension.

The flatpages function returns a `Promise` that resolves to a mapping of the traversed path, like this:

```
{
	'entry.md': {
		meta: {
			title: 'Hello, world!'
		},
		body: '# Greetings!',
		html: '<h1>Greetings!</h1>'
	}
}
```

Each parsed file will have these attributes:

- meta: An object representing the deserialized YAML at the top of the file.

- body: The Markdown text of your page. Ex: `# Cats on Roombas\n\nPlease, partake of them:\n\n...`

- html: The Markdown text of your page rendered into HTML. Ex: `<h1>Cats on Roombas</h1>...`

## Tests

`npm test`
