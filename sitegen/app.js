var fileman = require('./fileman');

// get the drafts
var drafts = fileman.getDraftFiles('draft');
console.log(drafts);

drafts.forEach(function(draft){
    fileman.createPost(draft);
    });
    
    drafts.sort(function(a, b) {
        if (Date.parse(a.createDate) > Date.parse(b.createDate)) return -1;
        if (Date.parse(a.createDate) < Date.parse(b.createDate)) return 1;
        if (Date.parse(a.createDate) == Date.parse(b.createDate)) return 0;
    });

console.log(drafts);

//console.log(JSON.stringify(drafts));

//fileman.saveMetadata(drafts);

/*
var fs = require('fs');
var file = __dirname + '/index.json';

fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }

    data = JSON.parse(data);

    data.sort(function(a, b) {
        if (Date.parse(a.createDate) > Date.parse(b.createDate)) return -1;
        if (Date.parse(a.createDate) < Date.parse(b.createDate)) return 1;
        if (Date.parse(a.createDate) == Date.parse(b.createDate)) return 0;
    });

    data.forEach(function(data) {
        console.log(data);
    });
});
*/