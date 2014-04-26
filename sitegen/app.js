/*
var markdown = require("markdown").markdown;
var handlebars = require("handlebars");
var fs = require('fs');

var template = fs.readFileSync("./index.html", "utf8");

var frontMatter = require('yaml-front-matter'),
    results = frontMatter.loadFront('README', 'content');


console.log(results.content);

var source = {
    title: results.title,
    content: markdown.toHTML("" + results.content)
};

var pageBuilder = handlebars.compile(template);
var pageText = pageBuilder(source);

console.log(pageText);
*/

// Read draft mark downs from draft folder
var draftfolder = 'draft';
var templateFolder = "template";
var fs = require('fs');
var path = require('path');

var draftList = fs.readdirSync(draftfolder);

for (var i = 0; i < draftList.length; i++) {
    console.log(path.join(draftfolder, draftList[i]));
    generatehtml("post.html", path.join(draftfolder, draftList[i]))
}


// for each of the files convert markdown to html
function generatehtml(templateName, markdownfile) {
    var templateFile = path.join(templateFolder, templateName);
    var handlebars = require("handlebars");
    var frontMatter = require('yaml-front-matter');
    var markdown = require("markdown").markdown;

    var template = fs.readFileSync(templateFile, "utf8");

    var results = frontMatter.loadFront(markdownfile, 'content');

    var source = {
        title: results.title,
        content: markdown.toHTML(results.content)
    };

    var pageBuilder = handlebars.compile(template);
    var pageText = pageBuilder(source);

    console.log(pageText);

}
// read post template from templates folder

// insert markdown converted to  html into the post template

// create a folder based on the category specifed in markdown if it doesnt exist

// create a file name based on the title with spaces stripped out

// if file already exists, create a