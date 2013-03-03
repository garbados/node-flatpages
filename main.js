var walk = require('walk')
	, fs = require('fs')
	, path = require('path')
	, yaml = require('js-yaml')
	, markdown = require('markdown')
	, walker = walk.walk(path.join(__dirname, 'pages'));

var Page = function(opts){
	var partition = opts.text.split('\n\n')
		, _self = this;
	_self.path = opts.path;
	_self.meta = yaml.load(partition[0]);
	_self.body = partition.slice(1).join('\n\n');
	_self.html = markdown.markdown.toHTML(_self.body);
}

var Pages = function(opts){
	this._opts = opts;
	this.init = function(opts){
		var _self = this;
		this.root = path.join(
			opts && opts.root || __dirname, 
			opts && opts.folder || 'pages');
		this.walker = walk.walk(this.root);
		this.files = {};
		this.walker.on('file', function(root, stat, next){
			var accessor = path.join(root.replace(_self.root+path.sep,'')
																	 .replace(_self.root,''),
															 stat.name);
			fs.readFile(path.join(root, stat.name), function(err, data){
				var new_page = new Page({
					text: data.toString(),
					path: accessor
				});
				_self.files[accessor] = new_page;
			});
			next();
		});
	}
	this.init(opts);
}

this.init = function(opts){
	var _self = this;
	this.root = path.join(
		opts && opts.root || __dirname, 
		opts && opts.folder || 'pages');
	this.walker = walk.walk(this.root);
	this.files = {};
	this.walker.on('file', function(root, stat, next){
		var accessor = path.join(root.replace(_self.root+path.sep,'')
																 .replace(_self.root,''),
														 stat.name);
		fs.readFile(path.join(root, stat.name), function(err, data){
			var new_page = new Page({
				text: data.toString(),
				path: accessor
			});
			_self.files[accessor] = new_page;
		});
		next();
	});
}

Pages.prototype.reload = function(){
	this.init(this._opts);
}

Pages.prototype.get = function(path){
	return this.files[path];
}

Pages.prototype.all = function(){
	var result = []
		, _self = this;
	for(key in _self.files){
		result.push(_self.files[key]);
	}
	return result;
}

module.exports = Pages;