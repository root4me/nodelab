var f = require('./fileman');
var fs = require('fs');

var list1 = [];
var list2 = [];
var readcompare = 1;
var generatefile = 0;

if (generatefile == 1) {
    f.generatesample('tmp/template.txt', 1000000);
}

if (readcompare == 1) {
    f.readfile('tmp/srcIds1.txt', 0, 13, false, function(a) {
        console.log('1 done : ' + a.length);
        list1 = a;
        console.log('list 1 : ' + list1.length);
        readdone(1);
    });


    f.readfile('tmp/srcIds.txt', 0, 13, false, function(a) {
        console.log('2 done');
        list2 = a
        console.log('list 2 : ' + list2.length);
        readdone(2);
    });

    var dcount = 0;
    var readdone = function(a) {
        dcount++;
        console.log('done : ' + dcount);

        if (dcount == 2) {
            //console.log(list1.length);
            //console.log(list2.length);
            diffLists(list2, list1);
        }
    };


    // list1 is the larger list. Create a diff file with the itmes in list1 that doesnt exist in list2
    var diffLists = function(list1, list2) {
        console.log('inside diff : ' + list1.length);
        for (var i = 0; i < list1.length; i++) {
            //console.log(list1[i]);
            var pos = -1;

            if (list2.indexOf(list1[i]) == -1) {
                //                list2.splice(pos, 1);
                console.log(list1[i]);
                fs.appendFileSync('tmp/diff.txt', list1[i] + '\n');
            }
            else {
                //  console.log('not found : ' + list1[i]);
                //not found
            }
        }
        console.log('1 : ' + list1.length);
        console.log('2 : ' + list2.length);
        //        console.log(util.inspect(process.memoryUsage()));
    };
}