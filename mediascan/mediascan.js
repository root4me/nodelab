var fs = require('fs');
var path = require('path');


var f = 0; // number of files processed
var d = 0; // number of directories processed (including the root directory passed in as commandline parameter)
var ta = 0; // used to keep track of total assets processed (sub dir + files)
var mf = 0; // media found
var ad = 0;
var im = 0;
var vd = 0;
var pad = 0; // potentially audio

var mime = require('mime-sniffer');

// Recursively read contents of the directory
var scan = function(dir, callback) {

    d++;
    if (!fs.existsSync(dir)) {
        console.log('Path doesnt exist : ' + dir);
    }

    var dc = fs.readdirSync(dir);

    //console.log('dir -> ' + dir);

    ta = ta + dc.length;

    for (var i = 0; i < dc.length; i++) {

        var p = path.resolve(dir, dc[i]);
        try {
            if (fs.statSync(p).isFile()) {
                getfiletype(p, function(file, mime) {
                    f++;
                    if (mime != undefined) {
                        if (mime.indexOf('audio') == 0 || mime.indexOf('video') == 0 || mime.indexOf('image') == 0 || mime.indexOf('application/octet-stream; charset=binary') ==0) {
                            console.log(file + " -> " + mime);
                            mf++;
                            if (mime.indexOf('audio') == 0) ad++;
                            if (mime.indexOf('video') == 0) vd++;
                            if (mime.indexOf('image') == 0) im++;
                            if (mime.indexOf('application/octet-stream; charset=binary') == 0) pad++; // This seem to happen for mp3 with album art embeded
                        }
                    }
                    callback(null, file);
                })
            }
            else if (fs.statSync(p).isDirectory()) {
                scan(p, callback);
            }
            else {
                console.log("not a file and not a directory .. wtf !")
            }
        }
        catch (e) {
            console.log(e);
            // need to reduce on from total assets since this exception would have failes processing of one file or directory
            // so far only time i have seen this happen is when statSync is called on a circular symbolic link
            // ELOOP, too many symbolic links encountered 

            ta--;
        }
    }
}

var mmm = require('mmmagic'),
    Magic = mmm.Magic;

var getfiletype = function(file, callback) {
    var magic = new Magic(mmm.MAGIC_MIME);

    magic.detectFile(file, function(err, mime) {
        if (err) {
            console.log(file + " -> " + err);
        }
        //console.log(file + " -> " + mime);
        callback(file, mime);
    });
}


scan(process.argv[2], function(data) {
    //console.log('i=' + it + ' - ' + 'j=' + j + ' - rc=' + rc);

    if (ta == (f + (d - 1))) {
        console.log('dir count -> ' + (d - 1));
        console.log('files count -> ' + f);
        console.log('audio files -> ' + ad);
        console.log('maybe audio -> ' + pad);
        console.log('video files -> ' + vd);
        console.log('image files -> ' + im);
        console.log('Total media -> ' + mf);
    }

});
