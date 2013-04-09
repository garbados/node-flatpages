var walk = require('walk')
	, fs = require('fs')
	, path = require('path')
	, yaml = require('js-yaml')
	, markdown = require('markdown')
	, walker = walk.walk(path.join(__dirname, 'pages'));

var Page = function(opts){
	opts.text = opts.text.replace(/(\r\n|\n|\r)/gm,"\n")
	var split = opts.text.indexOf("\n\n")
		, meta = opts.text.substring(0, split)
		, body = opts.text.substring(split);
	this.path = opts.path;
	this.body = body;
	this.html = markdown.markdown.toHTML(body);
	this.meta = yaml.load(meta);
}

var Pages = function(opts, cb){
	this._opts = opts;
	this.init = function(opts, cb){
		var _self = this;
		_self.root = path.join(
			opts && opts.root || __dirname, 
			opts && opts.folder || 'pages');
		_self.extension = opts && opts.extension || 'md';
		var walker = walk.walk(this.root);
		_self.files = {};

		walker.on('file', function(root, stat, next){
			// only grab file if the extension matches
			if(stat.name.indexOf(_self.extension) > -1) {
				// reduce file path to what's relative from _self.root
				var accessor = path.join(root.replace(_self.root+path.sep,'')
																		 .replace(_self.root,''),
																 stat.name);
				
				// strip file extension
				accessor = accessor.split('.');
				if (accessor[accessor.length - 1] === _self.extension){
					accessor = accessor.slice(0,-1).join('.');
				}else{
					accessor = accessor.join('.');
				}

				// read file, add to _self.files
				fs.readFile(path.join(root, stat.name), function(err, data){
					var new_page = new Page({
						text: data.toString(),
						path: accessor
					});
					_self.files[accessor] = new_page;
					next();
				});
			}else{
				next();
			}
		});

		walker.on('end', function(){
			if(cb) cb(_self);
		})
	}
	this.init(opts, cb);
}

Pages.prototype.reload = function(cb){
	this.init(this._opts, cb);
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