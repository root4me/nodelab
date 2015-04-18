var fs = require('fs');
var path = require('path');


var f = 0; // number of files processed
var d = 0; // number of directories processed (including the root directory passed in as commandline parameter)
var ta = 0; // used to keep track of total assets processed (sub dir + files)
var mf = 0; // media found
var ad = 0; // audio found
var im = 0; // image found
var vd = 0; // video found

var saveresult = false;
var outfile = 'mediascan.out.txt';

console.log('USAGE -> node mediascan ~/Downloads/Test [-save]');

if (process.argv[2] == undefined) process.exit();

if (process.argv[3] != undefined) {
    if (process.argv[3].indexOf('-s') > -1) {
        saveresult = true;
        if (fs.existsSync(outfile)) fs.unlinkSync(outfile);
    }
}


// Recursively read contents of the directory
var scan = function(dir, saveresults, callback) {

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
                        if (mime.indexOf('audio') == 0 || mime.indexOf('video') == 0 || mime.indexOf('image') == 0 || mime.indexOf('application/octet-stream; charset=binary') == 0) {
                            console.log(file + " -> " + mime);
                            mf++;
                            if (mime.indexOf('audio') == 0) {
                                ad++;
                                if (saveresults) fs.appendFileSync(outfile, 'audio,' + file + '\n');
                            }
                            else if (mime.indexOf('video') == 0) {
                                vd++;
                                if (saveresults) fs.appendFileSync(outfile, 'video,' + file + '\n');
                            }
                            else if (mime.indexOf('image') == 0) {
                                im++;
                                if (saveresults) fs.appendFileSync(outfile, 'image,' + file + '\n');
                            }

                        }
                    }
                    callback(null, file);
                })
            }
            else if (fs.statSync(p).isDirectory()) {
                scan(p, saveresults, callback);
            }
            else {
                console.log("not a file and not a directory .. wtf !")
            }
        }
        catch (e) {
            console.log(e);
            // need to reduce one from total assets since this exception would have failes processing of one file or directory
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
            callback(file, mime);
        }

        else {
            // Work around for problem detecting some MP3 file . When MP3 has album art embedded in it; mime type is returning as 'application/octet-stream; charset=binary'
            // Running file --mime [file name] gives the same result
            // Runnig file [file name] come back with 'Audio file with ID3 xxxxxxx'
            // So, using that as a fall back mechanism to detect MP3 and setting the mime to 'audio/mpeg; charset=binary'
            if (mime.indexOf('application/octet-stream; charset=binary') == 0) {
                new Magic().detectFile(file, function(err, mime) {
                    if (mime.toLowerCase().indexOf('audio') > -1) {
                        mime = 'audio/mpeg; charset=binary';
                    }
                    callback(file, mime);
                });
            }
            else {
                callback(file, mime);
            }
        }
    });
}


scan(process.argv[2], saveresult, function(data) {
    //console.log('i=' + it + ' - ' + 'j=' + j + ' - rc=' + rc);

    if (ta == (f + (d - 1))) {
        console.log('dir count -> ' + (d - 1));
        console.log('files count -> ' + f);
        console.log('audio files -> ' + ad);
        console.log('video files -> ' + vd);
        console.log('image files -> ' + im);
        console.log('Total media -> ' + mf);
    }

});
