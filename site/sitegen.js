var fs = require('fs');
var frontMatter = require('yaml-front-matter');
var handlebars = require("handlebars");
var markdown = require("markdown").markdown;
var path = require('path');

var config = {
    dfolder: 'draft', //draft folder
    tfolder: 'template', //template folder
    ptemplate: 'post.html', //basic post template
    pfolder: 'publish'
};


// gather the draft files to process
var getdrafts = function() {
    var files = fs.readdirSync(config.dfolder);
    var list = [];

    for (var i = 0; i < files.length; i++) {
        if (fs.statSync(path.resolve(config.dfolder, files[i])).isFile()) {
            list.push(getmetadata(files[i]));
        }
    }

    return list;
}

// Input a file name from the draft folder and get back metadata
var getmetadata = function(f) {
    var d = {};
    var fmatter = frontMatter.loadFront(path.resolve(config.dfolder, f), 'content');

    d.name = f;
    d.id = path.basename(f, path.extname(f));
    d.mdate = fs.statSync(path.resolve(config.dfolder, f)).mtime; // get the modified date of the file
    d.cdate = fs.statSync(path.resolve(config.dfolder, f)).ctime; // get the create date of the file

    return d;
}

//sort descending
var sort = function(list) {
    list.sort(function(a, b) {
        if (parseFloat(a.id) > parseFloat(b.id)) return -1;
        if (parseFloat(a.id) < parseFloat(b.id)) return 1;
        if (parseFloat(a.id) == parseFloat(b.id)) return 0;
    });
}

var resolvehrefforid = function(a) {

    var fmatter = frontMatter.loadFront(path.resolve(config.dfolder, a.href + '.md'), 'content');
    a.href = fmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html";
    a.desc = (a.desc.trim() === '') ? fmatter.title : a.desc;
    return a;
}

//create post
var generatepost = function(f, p, n) {

    if (!(fs.existsSync(path.resolve(config.pfolder)))) {
        fs.mkdirSync(path.resolve(config.pfolder));
    }

    var template = fs.readFileSync(path.resolve(config.tfolder, config.ptemplate), 'utf8');
    var fmatter = frontMatter.loadFront(path.resolve(config.dfolder, f.name), 'content');

    // If the next or previous file in the list does not have a numeric file name, do not link to them
    var pfmatter = (p !== null && !(isNaN(parseFloat(f.id))) && !(isNaN(parseFloat(p.id)))) ? frontMatter.loadFront(path.resolve(config.dfolder, p.name), 'content') : null;
    var nfmatter = (n !== null && !(isNaN(parseFloat(f.id))) && !(isNaN(parseFloat(n.id)))) ? frontMatter.loadFront(path.resolve(config.dfolder, n.name), 'content') : null;

    var publishFileName = path.resolve(config.pfolder, fmatter.title.replace(/\s+/g, '-').toLowerCase() + ".html"),
        pageBuilder = handlebars.compile(template),
        pageText = pageBuilder({
            title: fmatter.title,
            desc: fmatter.desc,
            author: fmatter.author,
            date: fmatter.date,
            content: markdown.toHTML(fmatter.content),
            prevPageTitle: pfmatter !== null ? pfmatter.title : '',
            prevPage: pfmatter !== null ? pfmatter.title.replace(/\s+/g, '-').toLowerCase() : '',
            nextPageTitle: nfmatter !== null ? nfmatter.title : '',
            nextPage: nfmatter !== null ? nfmatter.title.replace(/\s+/g, '-').toLowerCase() : ''
        });

    fs.writeFileSync(publishFileName, pageText, "utf8");

}

// Need to have a better way to only copy used images. But for now, just copying everything from drafts/img to publish/img
var copyimgs = function() {

    if (!(fs.existsSync(path.resolve(config.pfolder, 'img')))) {
        fs.mkdirSync(path.resolve(config.pfolder, 'img'));
    }

    if (fs.existsSync(config.dfolder + '/img')) {
        var files = fs.readdirSync(config.dfolder + '/img');

        for (var i = 0; i < files.length; i++) {
            if (fs.statSync(path.resolve(config.dfolder + '/img', files[i])).isFile()) {
                fs.createReadStream(path.resolve(config.dfolder + '/img', files[i])).pipe(fs.createWriteStream(path.resolve(config.pfolder + '/img', files[i])));
            }
        }
    }
}

// rebuils
module.exports.rebuildall = function(o) {

    if (o !== undefined) {
        config.dfolder = o.dfolder !== undefined ? o.dfolder : config.dfolder;
        config.tfolder = o.tfolder !== undefined ? o.tfolder : config.tfolder;
        config.pfolder = o.pfolder !== undefined ? o.pfolder : config.pfolder;
    }

    console.log('source folder : ' + config.dfolder);
    console.log('publish folder : ' + config.pfolder);

    var drafts = getdrafts();
    sort(drafts);
    for (var i = 0; i < drafts.length; i++) {
        generatepost(drafts[i], i == drafts.length - 1 ? null : drafts[i + 1], i > 0 ? drafts[i - 1] : null);
    }

    // When rebuildall is run from inside grunt file in /site , copy never seem to work
    // It alway generates empty files inside the publish directory. So, commenting this out for now and instead handle copying images in grunt script itself
    // copyimgs();

    console.log('done generating site...!');
}
