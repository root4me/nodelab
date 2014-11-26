var fs = require('fs'),
    frontMatter = require('yaml-front-matter'),
    path = require('path');

module.exports.config = {
    dfolder: 'draft',
    tfolder: 'template'
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
module.exports.createpost = function(a) {

}