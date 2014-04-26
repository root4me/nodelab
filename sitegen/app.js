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

for (var i = 0; i < draftList.length; i++) {

    console.log(path.join(draftFolder, draftList[i]));

    if (draftList[i].indexOf('_') !== 0) {
        generatehtml("post.html", templateFolder, draftList[i], draftFolder);
    }

}


function isValidDraft(markdownfile) {
    var article = frontMatter.loadFront(markdownfile, 'content');
    if (article.title === undefined) return false;
    return true;
}


function generatehtml(templateName, templateFolder, draftFile, draftFolder) {

    var template = fs.readFileSync(path.join(templateFolder, templateName), 'utf8');
    var article = frontMatter.loadFront(path.join(draftFolder, draftFile), 'content');
    var publishFileName = null;

    if (article.title !== undefined) {
        // Replace all white spaces in the title with - 
        publishFileName = path.join(publishFolder, article.title.replace(/\s+/g, '-') + ".html");
    }
    else {

        console.log('-- Draft with out title can not be processed : ' + draftFile);

        // No point in going further        
        return;
    }

    var source = {
        title: article.title,
        author: article.author,
        date: article.date,
        content: markdown.toHTML(article.content)
    };

    var pageBuilder = handlebars.compile(template);
    var pageText = pageBuilder(source);

    // console.log(pageText);

    if (publishFileName !== null) {

        if (fs.existsSync(publishFileName)) {
            console.log('uh oh .. destination file exists');
            console.log('source : ' + draftFile + ' -> dest : ' + publishFileName);
        }
        else {

            if (!(fs.existsSync(publishFolder))) {
                fs.mkdirSync(publishFolder);
            }
            fs.writeFileSync(publishFileName, pageText, "utf8");

            console.log('-- published : ' + publishFileName);
            // Prepend the draft file with an _
            fs.renameSync(path.join(draftFolder, draftFile), path.join(draftFolder, '_' + draftFile));
        }
    }

}
