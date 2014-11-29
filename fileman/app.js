var f = require('./fileman');
var fs = require('fs');

var list1 = [];
var list2 = [];
var readcompare = 1;
var generatefile = 0;

if (generatefile == 1) {
    //f.generatesample('tmp/template.txt', 2000000, 'tmp/sample2m.txt');
    //f.generatesample('tmp/template.txt', 1000000, 'tmp/sample1m.txt');

    // do this only after the above files exist
    f.saveidlist('tmp/sample2m.txt', 'tmp/2mIds.txt'); // think existing data here 
    f.saveidlist('tmp/sample1m.txt', 'tmp/1mIds.txt'); // massaging the incoming data
}

if (readcompare == 1) {

console.time('...total time to process');

    f.readidlist('tmp/2mIds.txt', 0, 13, false, function(a) {
        list1 = a;
        console.log('list 1 lenght : ' + list1.length);
        readdone(1);
    });


    f.readidlist('tmp/1mIds.txt', 0, 13, false, function(a) {
        list2 = a
        console.log('list 2 length : ' + list2.length);
        readdone(2);
    });

    var dcount = 0;
    var readdone = function(a) {
        dcount++;
        //console.log('done populating list ' + dcount);

        if (dcount == 2) {
            diffLists(list1, list2);
        }
    };


    // list1 is the larger list. Create a diff file with the itmes in list1 that doesnt exist in list2
    var diffLists = function(list1, list2) {
        console.log('Start doing diff between lists of ' + list1.length + ' and ' + list2.length);
        var out = 'tmp/diff.txt';
        console.log('Output : ' + out);

        console.time('Time to sort : ' + list1.length);
        console.log('sorting list 1 ..');
        f.sort(list1);
        console.timeEnd('Time to sort : ' + list1.length);
        console.time('Time to sort : ' + list2.length);
        console.log('sorting list 2 ..');
        f.sort(list2);
        console.timeEnd('Time to sort : ' + list2.length);
        
        if (fs.existsSync(out)) {
            fs.unlinkSync(out);
        }

        var pos = 0; // position at which the match was found in list 2
        var lastpos = 0; // position at which the match was found in list 2 last time. In a sorted list, next time indexOf need to be done only from this position. 
                        // Scannig from position 0 is a waste and extremely bad for performance on long lists
        var diffcount = 0;
        
        console.time('Time to generate ' + out);
        for (var i = 0; i < list1.length; i++) {
            //console.log(lastpos);
            pos = list2.indexOf(list1[i], lastpos);
            
            if (pos == -1) {
                //console.log('#');
                fs.appendFileSync(out, list1[i] + '\n');
                diffcount++;
            }
            else {
                lastpos = pos;
                //console.log(i);
            }
        }
        console.log('diff count : ' + diffcount);
        console.timeEnd('Time to generate ' + out);
        
        console.timeEnd('...total time to process');
    };


}