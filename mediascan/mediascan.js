var fs = require('fs');
var path = require('path');


var found = 0;

var it = 0;
var j = 0;
var rc = 0;

// Recursively read contents of the directory
var scan = function(dir, cb) {

    //it++;
     rc++;
    if (!fs.existsSync(dir)) {
        console.log('Path doesnt exist : ' + dir);
    }

    var dc = fs.readdirSync(dir);

    j = j + dc.length;

    for (var i = 0; i < dc.length; i++) {

        var p = path.resolve(dir, dc[i]);

        if (fs.statSync(p).isFile()) {
            getfiletype(p, function(file, mime) {
                it++;
                if (mime != undefined) {
                    if (mime.indexOf('audio') > -1 || mime.indexOf('video') > -1 || mime.indexOf('image') > -1) {
                        console.log(file + " -> " + mime);
                        found++;
                        //console.log('found - ' + found);
                    }
                }
                cb('d..');
            })
        }
        else if (fs.statSync(p).isDirectory()) {
            scan(p, cb);
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


scan(process.argv[2], function(data) {
        
    //console.log('i=' + it + ' - ' + 'j=' + j + ' - rc=' + rc);
    
    if (it == rc)
    {
        console.log('dir count -> ' + (rc -1));
    }
    
    if (j == (it+ (rc -1))) {
        console.log('dir count -> ' + (rc -1));
        console.log('found media -> ' + found);
    }

});
