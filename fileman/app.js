var f = require('./fileman');

var list1 = [];
var list2 = [];


f.readfile('tmp/sample.txt', function(a){
    console.log('1 done');
    list1 = a;
    readdone(1);
    });
    
f.readfile('tmp/sampleout1.txt', function(a){
    console.log('2 done');
    list2 = a
    readdone(2);
    });

var dcount = 0;
var readdone = function(a) {
    dcount++;
    console.log('done : ' + dcount);

    if (dcount == 2) {
        //console.log(list1.length);
        //console.log(list2.length);
        diffLists(list1,list2);
    }
};


var diffLists = function(list1,list2){
    console.log('inside diff : ' + list1.length);
    for (var i = 0; i<list1.length; i++)
    {
        //console.log(list1[i]);
        var pos = -1;
        
        if ((pos = list2.indexOf(list1[i])) >= 0)
        {
            list2.splice(pos,1);
        }
        else
        {
            console.log('not found : ' + list1[i]);
            //not found
        }
    }
        console.log('1 : ' + list1.length);
        console.log('2 : ' + list2.length);
//        console.log(util.inspect(process.memoryUsage()));
};
