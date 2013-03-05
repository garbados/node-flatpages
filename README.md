# Node-Pages: Flask-FlatPages for Node.js

Like [Flask-FlatPages](http://pythonhosted.org/Flask-FlatPages/), Node-Pages recursively collects text files from a given directory and exposes them as Pages, made up of metadata stored as YAML, and a text body written in Markdown. For example:

	tags:
		- cats
		- roombas
		- cats on roombas

	# Cats on Roombas

	Please, partake of them:

	* [Attack Roomba](http://www.youtube.com/watch?v=vf9wHkkNGUU)
	* [Roomba Driver](http://www.youtube.com/watch?v=LQ-jv8g1YVI)
	* [Captain del Roomba](http://www.youtube.com/watch?v=Ep80TSVQe70)

Renders:

	{
		path: 'path/to/file/relative/to/project/root',
		meta: {
			tags: ['cats', 'roombas', 'cats on roombas']
		},
		body: '# Cats on Roombas\n\nPlease, partake of them:\n\n...',
		html: '<h1>Cats on Roombas</h1>...'
	}

## Installation

	npm install node-pages

## Usage

	var FlatPages = require('pages');

	var Pages = new FlatPages({
		root: __dirname, 	// folder above your pages directory
		folder: 'pages', 	// name of the pages directory
		extension: 'md'		// file extension for pages you want to grab
	}, function(loaded_ages){
		loaded_pages.all() 	// returns an array of all found pages
	});

### A note about parsing YAML and Markdown

Node-Pages breaks pages at the first empty line, assuming everything above it is YAML, and everything below it is Markdown. Thus, if you want no YAML on your page, make its first line blank.

## API

### Pages

#### new Pages(options, callback)

Creates a new Pages object. `options` can contain the following:

* `root`: folder above your pages directory, defaults to __dirname
* `folder`: name of the pages directory, defaults to 'pages'
* `extension`: file extension for pages you want gathered, defaults to 'md'

The callback receives the full-fledged Pages object as its only argument.

#### get(path)

Returns the Page object at that path. Ex:

	var page = Pages.get('catsonroombas')
	page.path
	> 'catsonroombas'

#### all()

Returns all pages as an array.

#### init(options, callback)

Recreates the Pages object using different options. The callback receives the full-fledged Pages object as its only argument.

#### reload(callback)

Recreates the Pages object using the same options as during its first creation, in case the filesystem has changed in the meantime. The callback receives the full-fledged Pages object as its only argument.

### Page

#### path

The accessor used for getting the object from Pages, corresponding to the directory path to the file from Pages' root minus the file extension. For example, consider this file heirarchy, where / is Pages' root.

	/
		app.js
		/pages
			catsonroombas.md
			/nested
				moar_cats.md

The `path` for `catsonroombas.md` would be `catsonroombas`. For `moar_cats.md`, if would be `nested/moar_cats`.

#### meta

An object representing the deserialized YAML at the top of the file.

#### body

The Markdown text of your page. Ex: `# Cats on Roombas\n\nPlease, partake of them:\n\n...`

#### html

The Markdown text of your page rendered into HTML. Ex: `<h1>Cats on Roombas</h1>...`

## Tests

	npm test node-pages