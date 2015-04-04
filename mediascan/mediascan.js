var fs = require('fs');
var path = require('path');

var found = 0;

// Recursively read contents of the directory
var scan = function(dir) {

    if (!fs.existsSync(dir)) {
        return console.log('Path doesnt exist : ' + dir);
    }

    var dc = fs.readdirSync(dir);

    for (var i = 0; i < dc.length; i++) {
        var p = path.resolve(dir, dc[i]);

        if (fs.statSync(p).isFile()) {
            //console.log(p);
            // find the file type using mmmagic
            getfiletype(p, function(file, mime) {
                if (mime.indexOf('audio') > -1 || mime.indexOf('video') > -1 || mime.indexOf('image') > -1) {
                    console.log(file + " -> " + mime);
                }
            })
        }
        else if (fs.statSync(p).isDirectory()) {
            scan(p);
        }
        else {
            console.log("not a file and not a directory .. wtf !")
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
        callback(file, mime);
    });

}


scan(process.argv[2]);

