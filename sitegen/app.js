var markdown = require( "markdown" ).markdown;
var handlebars = require("handlebars");
var fs = require('fs');

var template = fs.readFileSync("./index.html", "utf8");

var frontMatter = require('yaml-front-matter')
  , results = frontMatter.loadFront('README', 'content');
  
  
  console.log(results.content);

	var source = {
	    title: results.title,
		content : markdown.toHTML("" + results.content)
	};
	
	var pageBuilder = handlebars.compile(template);
	var pageText = pageBuilder(source);

console.log(pageText);
  
  /*
fs.readFile('README' , 'utf8' ,function (err, data) {
  if (err) throw err;
  
  console.log(data);
  
	var source = {
		message : markdown.toHTML("" + data)
	};
	
	var pageBuilder = handlebars.compile(template);
	var pageText = pageBuilder(source);
	
  
  //console.log(markdown.toHTML("" + data));
  
  //console.log(pageText);
  
});

*/

/*
var handlebars = require("handlebars");

var template = fs.readFileSync("./index.html", "utf8");

function onRequest(req, res) {

	var source = {
		message : "hey handlebars"
	};

	var pageBuilder = handlebars.compile(template);
	var pageText = pageBuilder(source);
	res.writeHead(200, {"Context-Type": "text/html"});
	res.write(pageText);
	res.end();
}
*/