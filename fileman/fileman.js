var conf = {

}


var fs = require('fs');
var ll = require('line-by-line');

module.exports.readfile = function(file, callback) {
    var lr = new ll(file);
    var list = [];

    lr.on('line', function(line) {
        list.push(line.substring(0, 13).trim());
    });

    lr.on('end', function() {
        callback(list);
    });
};

module.exports.generatesample = function(file) {
    var lr = new ll(file);
    var ln = '';
    var id = 1000000000000;

    lr.on('line', function(line) {
        if (line.trim().length !== 0) {
            ln = line;
        }
    });

    lr.on('end', function() {
        console.time('Time to generate sample');
        for (var i = 0; i < 100000; i++) {
            fs.appendFileSync('tmp/samplegen.txt', ln.replace('1000000000000', id++) + '\n');
        }
        console.timeEnd('Time to generate sample');
    });

};

/*
module.exports.readfile = function(file, callback) {

    var rs = fs.createReadStream(file, {
        flags: 'r',
        encoding: 'utf8',
        autoClose: true
    });

    var list = [];
    var rcount = 0;
    
    rs.on('readable', function() {
        var chunk;
        var data = '';
        var count = 0;

        var previd = '';
        while (null !== (chunk = rs.read(1))) {
            count++;

            if (count < 14) {
                data = data + chunk;
            }

            if (chunk == '\n') {
                rcount++;
                
                if (rcount == 37 || rcount==111 ) {rs.read(0);}
                
                console.log(data);
                if (data.trim().length !== 13 ) {console.log('row : ' + rcount + ' - : ' + data); console.log(count); console.log(previd); break;}
                else
                {
                previd = data;
                list.push(data);

                data = '';
                count = 0;
                rs.read(0);    
                }
            }
        }
    });

    rs.on('close', function() {
        //        console.log(list.indexOf('6012269273001'));
        callback(list);
    });
};
*/