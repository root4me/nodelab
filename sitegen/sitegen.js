var fs = require('fs'),
    frontMatter = require('yaml-front-matter'),
    handlebars = require("handlebars"),
    markdown = require("markdown").markdown,
    path = require('path');

module.exports.config = {
    dfolder: 'draft', //draft folder
    tfolder: 'template', //template folder 
    ptemplate0: 'post.html', //basic post template
    pfolder: 'publish'
};

module.exports.drafts = function() {
    var list = fs.readdirSync(this.config.dfolder);

    for (var i = 0; i < list.length; i++) {
        list[i] = this.getmetadata(list[i]);
    }
    return list;
}

// Input a file name from the draft folder and get back metadata
module.exports.getmetadata = function(f) {
    var d = {},
    fmatter = frontMatter.loadFront(path.join(this.config.dfolder, f), 'content');

    d.name = f;
    d.id = path.basename(f, path.extname(f));
    d.title = fmatter.title;
    d.auhor = fmatter.author;
    d.desc = fmatter.desc
    d.mdate = fs.statSync(path.join(this.config.dfolder, f)).mtime; // get the modified date of the file
    d.cdate = fs.statSync(path.join(this.config.dfolder, f)).ctime; // get the create date of the file

    return d;
}

//sort descending
module.exports.sort = function(list) {
    list.sort(function(a, b) {
        if (parseFloat(a.id) > parseFloat(b.id)) return -1;
        if (parseFloat(a.id) < parseFloat(b.id)) return 1;
        if (parseFloat(a.id) == parseFloat(b.id)) return 0;
    });
}

//create post
module.exports.createpost = function(f, p, n) {

    var template = fs.readFileSync(path.join(this.config.tfolder, this.config.ptemplate0), 'utf8'),
        fmatter = frontMatter.loadFront(path.join(this.config.dfolder, f.name), 'content');

    var pfmatter = p !== null ? frontMatter.loadFront(path.join(this.config.dfolder, p.name), 'content') : null;
    var nfmatter = n !== null ? frontMatter.loadFront(path.join(this.config.dfolder, n.name), 'content') : null;


    var publishFileName = path.join(this.config.pfolder, fmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html"),
        pageBuilder = handlebars.compile(template),
        pageText = pageBuilder({
            title: fmatter.title,
            author: fmatter.author,
            date: fmatter.date,
            content: markdown.toHTML(fmatter.content),
            prevPageTitle: pfmatter !== null ? pfmatter.title : '',
            prevPage: pfmatter !== null ? pfmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html" : '',
            nextPageTitle: nfmatter !== null ? nfmatter.title : '',
            nextPage: nfmatter !== null ? nfmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html" : ''
    });

    fs.writeFileSync(publishFileName, pageText, "utf8");

    //            console.log(publishFileName);
}