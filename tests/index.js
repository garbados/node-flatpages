var FlatPages = require('../main')
	, assert = require('assert')
	, Pages;

var tests = {
	// tests that creating the object completes without error
	// but does not assert functionality
	completion: function(cb){
		Pages = new FlatPages({
			folder: 'pages'
		}, cb);
	},
	// tests that both pages loaded
	has_pages: function(){
		assert.equal(Object.keys(Pages.files).length, 3);
	},
	// tests that Pages, and the files therein, have all the right properties
	interfaces: function(){
		// get
		for(path in Pages.files){
			var page = Pages.get(path);
			['path', 'body', 'html'].forEach(function(attr){
				assert.equal(typeof page[attr], typeof '');
			});
			assert.equal(typeof page.meta, typeof {});
		}
		// all
		Pages.all();
	},
	tricky: function(){
		var page = Pages.get('tricky');
		assert.equal(page.meta, null);
	},
	reload: function(cb){
		Pages.reload(cb);
	},
}

// init Pages
tests.completion(function(Pages){
	// run tests once initialized
	tests.has_pages();
	tests.interfaces();
	tests.tricky();
	tests.reload(function(){
		console.log('No errors! Wahoo!');
	});
});