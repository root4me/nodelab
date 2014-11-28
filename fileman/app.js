var f = require('./fileman');
var fs = require('fs');

var list1 = [];
var list2 = [];
var readcompare = 1;
var generatefile = 0;

if (generatefile == 1) {
    //f.generatesample('tmp/template.txt', 1000000, 'tmp/sample1m.txt');
    //f.generatesample('tmp/template.txt', 500000, 'tmp/sample500k.txt');
    
    // do this only after the above files exist
    //f.saveidlist('tmp/sample1m.txt', 'tmp/1mIds.txt'); // thik existing data here 
    //f.saveidlist('tmp/sample500k.txt', 'tmp/500kIds.txt'); // massaging the incoming data
}

if (readcompare == 1) {


        f.readidlist('tmp/1mIds.txt', 0, 13, false, function(a) {
            list1 = a;
            console.log('list 1 for compare : ' + list1.length);
            readdone(1);
        });


        f.readidlist('tmp/500kIds.txt', 0, 13, false, function(a) {
            list2 = a
            console.log('list 2 for compare : ' + list2.length);
            readdone(2);
        });

        var dcount = 0;
        var readdone = function(a) {
            dcount++;
            console.log('done populating list ' + dcount);

            if (dcount == 2) {
                diffLists(list1, list2);
            }
        };


        // list1 is the larger list. Create a diff file with the itmes in list1 that doesnt exist in list2
        var diffLists = function(list1, list2) {
            console.log('Start doing diff between lists of ' + list1.length + ' and ' + list2.length);
            var out = 'tmp/diff.txt';
            console.log('Output : ' +  out);
            
            console.time('Time to generate ' + out);
            for (var i = 0; i < list1.length; i++) {

                var pos = -1;

                if (list2.indexOf(list1[i]) == -1) {

                    fs.appendFileSync(out, list1[i] + '\n');
                }
                else {
                    //console.log('.');
                }
            }
//            console.log('1 : ' + list1.length);
//            console.log('2 : ' + list2.length);
            console.timeEnd('Time to generate ' + out);
        };


}