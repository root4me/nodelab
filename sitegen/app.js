var fs = require('fs');
var path = require('path');
var frontMatter = require('yaml-front-matter');
var handlebars = require("handlebars")
var markdown = require("markdown").markdown;

// These can go into a config file at some point
var draftFolder = 'draft';
var templateFolder = "template";
var publishFolder = "publish";

var draftList = fs.readdirSync(draftFolder);

var fileman = require('./fileman');
console.log(fileman.getDraftFiles('draft'));

var drafts = fileman.getDraftFiles('draft');

for (var i = 0 ; i < drafts.length; i++)
{
    fileman.createPost({
            name: 'post.html',
            path: 'template'
        }, drafts[i]);
}

