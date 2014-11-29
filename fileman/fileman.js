var fs = require('fs'),
    ll = require('line-by-line');

// file to read
// characters start to finish to read from row, user -1 as finish for while row
// save to disk or no
module.exports.readidlist = function(file, start, finish, save, callback) {
    console.log('fetching Ids from : ' +  file);
    console.time('Time to generate Id list from ' + file);
    var lr = new ll(file),
        list = [];
    
    lr.on('line', function(line) {
        list.push(line.substring(start, finish).trim());
    });

    lr.on('end', function() {
         console.timeEnd('Time to generate Id list from ' + file);
        callback(list);
    });
};


// extract ids from input file and write the out file
module.exports.saveidlist = function(input, out) {
    console.log('Extracting ids and saving id to : ' + out);
    
    console.time('Time to generate ' + out);    
    var lr = new ll(input);
    if (fs.existsSync(out)) {
        fs.unlinkSync(out);
    }
    
    lr.on('line', function(line) {
        fs.appendFileSync(out, line.substring(0, 13).trim() + '\n');
    });

    lr.on('end', function() {
        console.timeEnd('Time to generate ' + out);
    });

};

//sort ascending
module.exports.sort = function(list) {
    list.sort(function(a, b) {
        if (parseInt(a) > parseInt(b)) return 1;
        if (parseInt(a) < parseInt(b)) return -1;
        if (parseInt(a) == parseInt(b)) return 0;
    });
}

// input template file and number of rows to generate
// if there is a string '1000000000000', it will be replaced with incremental values indicating row Ids
module.exports.generatesample = function(template, rows, out) {
    var lr = new ll(template),
        ln = '',
        id = 1000000000000;

    console.log('Generating : ' + out);
    lr.on('line', function(line) {
        if (line.trim().length !== 0) {
            ln = line;
        }
    });

    lr.on('end', function() {
        if (fs.existsSync(out)) {
            fs.unlinkSync(out);
        }

        console.time('Time to generate ' + out);
        for (var i = 0; i < rows; i++) {
            fs.appendFileSync(out, ln.replace('1000000000000', id++) + '\n');
        }
        console.timeEnd('Time to generate ' + out);
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