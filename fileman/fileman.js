var conf = {

}


var fs = require('fs');

module.exports.readfile = function(file, callback) {

    var rs = fs.createReadStream(file, {
        flags: 'r',
        encoding: 'utf8',
        autoClose: true
    });

    var list = [];

    rs.on('readable', function() {
        var chunk;
        var data = '';
        var count = 0;
        while (null !== (chunk = rs.read(1))) {
            count++;
            if (count < 14) {
                data += chunk;
            }

            if (chunk == '\n') {
                //console.log(data);
                list.push(data);
                data = '';
                count = 0;
            }
        }
    });

    rs.on('close', function() {
        //        console.log(list.indexOf('6012269273001'));
        callback(list);
    });
};
