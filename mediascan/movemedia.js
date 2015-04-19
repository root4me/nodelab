var fs = require('fs');
var ll = require('line-by-line');
var path = require('path');

var filelist = 'mediascan.out.txt';
var outpath = 'media';

var lr = new ll(filelist)

console.log('USAGE -> node movemedia ~/Downloads/Testout/media');

if (process.argv[2] == undefined) process.exit();

outpath = process.argv[2];

lr.on('line', function(line) {
    movemedia(line.split(':')[0], line.split(':')[1]);
});

lr.on('end', function() {
    console.log('done..');

});

var movemedia = function(filetype, file) {

    console.log(path.resolve(outpath));

    if (!(fs.existsSync(path.resolve(outpath)))) fs.mkdirSync(path.resolve(outpath));
    if (!(fs.existsSync(path.resolve(outpath, 'audio')))) fs.mkdirSync(path.resolve(outpath, 'audio'));
    if (!(fs.existsSync(path.resolve(outpath, 'video')))) fs.mkdirSync(path.resolve(outpath, 'video'));
    if (!(fs.existsSync(path.resolve(outpath, 'image')))) fs.mkdirSync(path.resolve(outpath, 'image'));


    console.log('file -> ' + file);

    if (!(fs.existsSync(path.resolve(outpath, filetype, path.basename(file))))) {
        fs.createReadStream(file).pipe(fs.createWriteStream(path.resolve(outpath, filetype, path.basename(file))));

    }
    else {
        console.log(new Date().toJSON());
        fs.createReadStream(file).pipe(fs.createWriteStream(path.resolve(outpath, filetype, path.basename(file, path.extname(file)) + new Date().toJSON() + path.extname(file))));
    }
}