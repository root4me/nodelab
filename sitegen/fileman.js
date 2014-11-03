var fs = require('fs'),
    frontMatter = require('yaml-front-matter'),
    path = require('path'),
    markdown = require("markdown").markdown,
    handlebars = require("handlebars"),
    cheerio = require("cheerio");

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

        if (!(fs.statSync(path.join(draftFolder, draftList[i])).isDirectory())) {

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
                rejectReason: '',
                images: []
            });

        }
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
        if (!(fs.existsSync(path.join(fileInfo.publishPath, 'images')))) {
            fs.mkdirSync(path.join(fileInfo.publishPath, 'images'));
        }

        if (!(fs.existsSync(draftArchive))) {
            fs.mkdirSync(draftArchive);
        }

        var $ = cheerio.load(pageText);

        $('img').each(function() {
            var img = $(this).attr('src');

            if (!(fs.existsSync(path.join(draftFolder, img)))) {
            // Temporarily commenting this off since this prevents the content from getting generated if the link is to an external URL.
               // fileInfo.process = false;
                fileInfo.rejectReason += "Missing source image file : " + path.join(draftFolder, img);
                return;
            }

            if (fs.existsSync(path.join(publishFolder, '/images/' + img))) {
                fileInfo.process = false;
                fileInfo.rejectReason += "Image file with same name exists : " + path.join(publishFolder, '/images/' + img);
                return;
            }

            fileInfo.images.push({
                src: path.join(draftFolder, img),
                dest: path.join(publishFolder, img)
            })

        });

        console.log(fileInfo)

        if (fileInfo.process === true) {

            fs.writeFileSync(publishFileName, pageText, "utf8");

            fileInfo.images.forEach(function(img) {
                fs.createReadStream(img.src).pipe(fs.createWriteStream(img.dest));
            });

            console.log('-- published : ' + publishFileName);
        }
        else {
            console.log("-- Can not Process ... : " + fileInfo.rejectReason);
        }

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
    fileInfo.createDate = article.date;

    if (article.updateDate !== undefined) {
        fileInfo.updateDate = article.updateDate
    }
    else {
        fileInfo.updateDate = null;
    }

}


var getImgLinks = function(html) {

    // console.log(html);

    var $ = cheerio.load(html);

    $('a').each(function() {
        console.log($(this).attr('href'));
    });

    $('img').each(function() {

        console.log("Img path : " + $(this).attr('src'));
        console.log(fs.existsSync(path.join(draftFolder, $(this).attr('src'))));
    });

}
