var fs = require('fs'),
    frontMatter = require('yaml-front-matter'),
    handlebars = require("handlebars"),
    markdown = require("markdown").markdown,
    path = require('path');

module.exports.config = {
    dfolder: 'draft', //draft folder
    tfolder: 'template', //template folder 
    ptemplate: 'post.html', //basic post template
    pfolder: 'publish'
};

module.exports.rebuildall = function(o) {

    if (o !== undefined) {
        this.config.dfolder = o.dfolder !== undefined ? o.dfolder : this.config.dfolder;
        this.config.tfolder = o.tfolder !== undefined ? o.tfolder : this.config.tfolder;
        this.config.pfolder = o.pfolder !== undefined ? o.pfolder : this.config.pfolder;
    }

    console.log('source folder : ' + this.config.dfolder);
    console.log('publish folder : ' + this.config.pfolder);

    var drafts = this.drafts();
    this.sort(drafts);
    for (var i = 0; i < drafts.length; i++) {
        this.generatepost(drafts[i], i == drafts.length - 1 ? null : drafts[i + 1], i > 0 ? drafts[i - 1] : null);
    }
    this.copyimgs();

    console.log('done generating site...');
}

module.exports.drafts = function() {
    var files = fs.readdirSync(this.config.dfolder),
        list = [];

    for (var i = 0; i < files.length; i++) {
        if (fs.statSync(path.resolve(this.config.dfolder, files[i])).isFile()) {
            list.push(this.getmetadata(files[i]));
        }
    }

    return list;
}

// Input a file name from the draft folder and get back metadata
module.exports.getmetadata = function(f) {
    var d = {},
    fmatter = frontMatter.loadFront(path.resolve(this.config.dfolder, f), 'content');

    d.name = f;
    d.id = path.basename(f, path.extname(f));
    d.mdate = fs.statSync(path.resolve(this.config.dfolder, f)).mtime; // get the modified date of the file
    d.cdate = fs.statSync(path.resolve(this.config.dfolder, f)).ctime; // get the create date of the file

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
module.exports.generatepost = function(f, p, n) {

    if (!(fs.existsSync(path.resolve(this.config.pfolder)))) {
        fs.mkdirSync(path.resolve(this.config.pfolder));
    }

    var template = fs.readFileSync(path.resolve(this.config.tfolder, this.config.ptemplate), 'utf8'),
        fmatter = frontMatter.loadFront(path.resolve(this.config.dfolder, f.name), 'content');

    // index.md is a special case to generate the home screen. No need to process it like rest of the files.
    if (f.name == "index.md") {

        //row += ']}';
        var pt,
        pb = handlebars.compile(fs.readFileSync(path.resolve(this.config.tfolder, "indexpages.html"), 'utf8'));

        for (var i = 0; i < fmatter.rows.length; i++) {

            pt = pb(JSON.parse('{ "prev" : "' + ((i === 0) ? "index.html" : "index" + (i) + ".html") + '", ' + '"next" : "' + ((i === (fmatter.rows.length - 1)) ? "" : "index" + (i + 2) + ".html") + '",' + ' "rows" :[' + JSON.stringify(fmatter.rows[i]) + ']}'));

            fs.writeFileSync(path.resolve(this.config.pfolder, "index" + (i + 1) + ".html"), pt, "utf8");
        }

        //copy over the index page to output
        fs.createReadStream(path.resolve(this.config.tfolder + '/index.html')).pipe(fs.createWriteStream(path.resolve(this.config.pfolder + '/index.html')));

        return;
    }

    // If the next or previous file in the list does not have a numeric file name, do not link to them
    var pfmatter = (p !== null && !(isNaN(parseFloat(f.id))) && !(isNaN(parseFloat(p.id)))) ? frontMatter.loadFront(path.resolve(this.config.dfolder, p.name), 'content') : null;
    var nfmatter = (n !== null && !(isNaN(parseFloat(f.id))) && !(isNaN(parseFloat(n.id)))) ? frontMatter.loadFront(path.resolve(this.config.dfolder, n.name), 'content') : null;

    var publishFileName = path.resolve(this.config.pfolder, fmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html"),
        pageBuilder = handlebars.compile(template),
        pageText = pageBuilder({
            title: fmatter.title,
            desc: fmatter.desc,
            author: fmatter.author,
            date: fmatter.date,
            content: markdown.toHTML(fmatter.content),
            prevPageTitle: pfmatter !== null ? pfmatter.title : '',
            prevPage: pfmatter !== null ? pfmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html" : '',
            nextPageTitle: nfmatter !== null ? nfmatter.title : '',
            nextPage: nfmatter !== null ? nfmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html" : ''
        });

    fs.writeFileSync(publishFileName, pageText, "utf8");

    // console.log(publishFileName);
}

// Need to have a better way to only copy used images. But for now, just copying everything from drafts to publish
module.exports.copyimgs = function() {

    if (!(fs.existsSync(path.resolve(this.config.pfolder, 'img')))) {
        fs.mkdirSync(path.resolve(this.config.pfolder, 'img'));
    }

    if (fs.existsSync(this.config.dfolder + '/img')) {
        var files = fs.readdirSync(this.config.dfolder + '/img');

        for (var i = 0; i < files.length; i++) {
            if (fs.statSync(path.resolve(this.config.dfolder + '/img', files[i])).isFile()) {
                fs.createReadStream(path.resolve(this.config.dfolder + '/img', files[i])).pipe(fs.createWriteStream(path.resolve(this.config.pfolder + '/img', files[i])));
            }
        }
    }
}