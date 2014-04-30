var fs = require('fs'),
    frontMatter = require('yaml-front-matter'),
    path = require('path'),
    markdown = require("markdown").markdown,
    handlebars = require("handlebars");

// These can go into a config file at some point
var draftFolder = 'draft';
var templateFolder = "template";
var publishFolder = "publish";


module.exports.getDraftFiles = function(data) {

    var draftList = fs.readdirSync(data),
        files = [];


    for (var i = 0; i < draftList.length; i++) {
        console.log(draftList[i]);

        if (draftList[i].indexOf('_') === 0) {
            console.log('vvv');
        }

        files.push({
            name: draftList[i],
            path: draftFolder
        });
    }

    return files;

    // return (draftList);

    // console.log(draftList);
}

var newContentList = [];

module.exports.newContentList = function() {
    return newContentList;
}

module.exports.createPost = function(templateFile, draftFile) {

    var template = fs.readFileSync(path.join(templateFile.path, templateFile.name), 'utf8');
    var article = frontMatter.loadFront(path.join(draftFile.path, draftFile.name), 'content');
    var publishFileName = null;

    if (article.title !== undefined) {
        // Replace all white spaces in the title with - 
        publishFileName = path.join(publishFolder, article.title.replace(/\s+/g, '-') + ".html");
    }
    else {
        console.log('-- Draft with out title can not be processed : ' + draftFile.name);
        // No point in going further        
        return;
    }

    var pageBuilder = handlebars.compile(template);
    var pageText = pageBuilder({
        title: article.title,
        author: article.author,
        date: article.date,
        content: markdown.toHTML(article.content)
    });

    // console.log(pageText);

    if (publishFileName !== null) {

        if (fs.existsSync(publishFileName)) {
            console.log('uh oh .. destination file exists');
            console.log('source : ' + draftFile.name + ' -> dest : ' + publishFileName);
        }
        else {

            if (!(fs.existsSync(publishFolder))) {
                fs.mkdirSync(publishFolder);
            }
            fs.writeFileSync(publishFileName, pageText, "utf8");

            console.log('-- published : ' + publishFileName);
            // Prepend the draft file with an _
            //fs.renameSync(path.join(draftFolder, draftFile), path.join(draftFolder, '_' + draftFile));
        }
    }
}
