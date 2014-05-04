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

/*
        fileInfo.draftFile = 
        fileInfo.draftPath =
        fileInfo.publishFile =
        fileInfo.PublishPath =
        fileInfo.title =
        fileInfo.author = 
        fileInfo.createDate = 
        fileInfo.updateDate
        process: true,
        rejectReason: null,
        */

module.exports.getDraftFiles = function(data) {
    var draftList = fs.readdirSync(data),
        files = [];

    for (var i = 0; i < draftList.length; i++) {
        console.log(draftList[i]);


        files.push({
            draftFile: draftList[i],
            draftPath: draftFolder,
            publishFile: null,
            publishPath: null,
            title: null,
            author: null,
            createDate: null,
            updateDate: null,
            process: true,
            rejectReason: null,
        });
    }

    return files;
}

module.exports.createPost = function(fileInfo) {

    console.log(fileInfo.draftPath + ' -> ' + fileInfo.draftFile);

    var template = fs.readFileSync(path.join(templateFolder, postTemplate), 'utf8'),
        article = frontMatter.loadFront(path.join(fileInfo.draftPath, fileInfo.draftFile), 'content');

    getMetadata(fileInfo);

    if (fileInfo.process === true) {
        var publishFileName = path.join(fileInfo.publishPath, fileInfo.publishFile),
            pageBuilder = handlebars.compile(template),
            pageText = pageBuilder({
                title: article.title,
                author: article.author,
                date: article.date,
                content: markdown.toHTML(article.content)
            });


        if (!(fs.existsSync(fileInfo.publishPath))) {
            fs.mkdirSync(fileInfo.publishPath);
        }
        if (!(fs.existsSync(draftArchive))) {
            fs.mkdirSync(draftArchive);
        }

        fs.writeFileSync(publishFileName, pageText, "utf8");

        console.log('-- published : ' + publishFileName);
        // Prepend the draft file with an _
        //fs.renameSync(path.join(draftFolder, draftFile), path.join(draftFolder, '_' + draftFile));

        //           fileInfo.publishFile = publishFileName;
        // move draft to a archive folder
        //           fs.renameSync(path.join(fileInfo.draftPath, fileInfo.draftFIle), path.join(draftArchive, fileInfo.draftFile));
        //}

    }
    else {
        console.log("-- Can not Process ... : " + fileInfo.rejectReason);
    }

}


module.exports.saveMetadata = function(data) {
    // Save the list of metadat gathered for next time this toll runs

    fs.writeFileSync("index.json", JSON.stringify(data));
}

var getMetadata = function(fileInfo) {

    var article = frontMatter.loadFront(path.join(fileInfo.draftPath, fileInfo.draftFile), 'content');

    if (article.title === undefined) {
        fileInfo.process = false;
        fileInfo.rejectReason = "Title not present";
    }
    else {
        fileInfo.title = article.title;
        fileInfo.publishFile = article.title.replace(/\s+/g, '-') + ".html";
        fileInfo.publishPath = publishFolder;

        if (fs.existsSync(path.join(fileInfo.publishPath, fileInfo.publishFile))) {
            fileInfo.process = false;
            fileInfo.rejectReason = "Published content with same name exists";
        }
    }

    fileInfo.author = article.author;
    fileInfo.createDate = Date(article.date);

    if (article.updateDate !== undefined) {
        fileInfo.updateDate = article.updateDate
    }
    else {
        fileInfo.updateDate = null;
    }

}
