var fs = require('fs'),
    frontMatter = require('yaml-front-matter'),
    path = require('path'),
    markdown = require("markdown").markdown,
    handlebars = require("handlebars");

// These can go into a config file at some point
var draftFolder = 'draft',
    templateFolder = "template",
    publishFolder = "publish",
    postTemplate = 'post.html',
    draftArchive = "draftArchive";

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
            path: draftFolder,
            publishName: '',
        });
    }
    return files;
}

module.exports.createPost = function(draftFile) {

    console.log(draftFile.path + ' -> ' + draftFile.name);

    var template = fs.readFileSync(path.join(templateFolder, postTemplate), 'utf8'),
        article = frontMatter.loadFront(path.join(draftFile.path, draftFile.name), 'content');

    if (article.title === undefined) {
        console.log('-- Draft with out title can not be processed : ' + draftFile.name);
        return;
    }
    else {

        var publishFileName = path.join(publishFolder, article.title.replace(/\s+/g, '-') + ".html"),
            pageBuilder = handlebars.compile(template),
            pageText = pageBuilder({
                title: article.title,
                author: article.author,
                date: article.date,
                content: markdown.toHTML(article.content)
            });

        if (fs.existsSync(publishFileName)) {
            console.log('-- published content with same name exists .. skipping publish');
            console.log('source : ' + draftFile.name + ' -> dest : ' + publishFileName);
        }
        else {

            if (!(fs.existsSync(publishFolder))) {
                fs.mkdirSync(publishFolder);
            }
            if (!(fs.existsSync(draftArchive))) {
                fs.mkdirSync(draftArchive);
            }

            fs.writeFileSync(publishFileName, pageText, "utf8");

            console.log('-- published : ' + publishFileName);
            // Prepend the draft file with an _
            //fs.renameSync(path.join(draftFolder, draftFile), path.join(draftFolder, '_' + draftFile));

            draftFile.publishName = publishFileName;
            // move draft to a archive folder
            fs.renameSync(path.join(draftFile.path, draftFile.name) , path.join(draftArchive,draftFile.name));
        }
    }
}


module.exports.saveMetadata = function(data) {
    // Save the list of metadat gathered for next time this toll runs
    
    fs.writeFileSync("index.json", JSON.stringify(data));
}



