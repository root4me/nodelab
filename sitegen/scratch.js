
// not beign used. just scratch pad for some old code till it get reused or deleted

module.exports.createPost = function(fileInfo) {

    console.log(fileInfo.draftPath + ' -> ' + fileInfo.draftFile);

    var template = fs.readFileSync(path.join(templateFolder, postTemplate), 'utf8'),
        article = frontMatter.loadFront(path.join(fileInfo.draftPath, fileInfo.draftFile), 'content');

    //    getMetadata(fileInfo);

    if (fileInfo.process === true) {
        var publishFileName = path.join(fileInfo.publishPath, fileInfo.publishFile),
            pageBuilder = handlebars.compile(template),
            pageText = pageBuilder({
                title: article.title,
                author: article.author,
                date: article.date,
                nextPage: fileInfo.nextPage,
                nextPageTitle: fileInfo.nextPageTitle,
                prevPage: fileInfo.prevPage,
                prevPageTitle: fileInfo.prevPageTitle,
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

    //console.log(article.next);

    if (article.title === undefined) {
        fileInfo.process = false;
        fileInfo.rejectReason = "Title not present";
    }
    else {
        fileInfo.title = article.title;
        fileInfo.publishFile = article.title.replace(/\s+/g, '-').toLowerCase() + ".html";
        fileInfo.publishPath = publishFolder;
        if (article.next !== undefined) {
            fileInfo.nextPageTitle = article.next;
            //fileInfo.nextPage = article.next.replace(/\s+/g, '-').toLowerCase() + ".html";
            //basename
        }
        if (article.previous !== undefined) {
            fileInfo.prevPageTitle = article.previous;
            //fileInfo.prevPage = article.previous.replace(/\s+/g, '-').toLowerCase() + ".html";
        }
        /*        
        if (fs.existsSync(path.join(fileInfo.publishPath, fileInfo.publishFile))) {
            fileInfo.process = false;
            fileInfo.rejectReason = "Published content with same name exists";
        }
*/
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