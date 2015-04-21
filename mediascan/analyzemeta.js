var fs = require('fs');
var path = require('path');
var ll = require('line-by-line');

var infile = 'audioindex.txt';

var lr = new ll(infile)
var meta;
var metalist = [];

//outpath = process.argv[2];

lr.on('line', function(line) {
    //movemedia(line.split(':')[0], line.split(':')[1]);
    meta = JSON.parse(line);
    //console.log(meta.tags);
    
    for (var key in meta.tags) {
        //console.log(key);
        //console.log(meta.tags[key]);
        
        if (metalist.indexOf(key) == -1) metalist.push(key);
        
    }

});

lr.on('end', function() {
    
    console.log(metalist);
    console.log('done..');

});

/*
'title',
  'track',
  'genre',
  'artist',
  'album',
  'date',
  'TLEN',
  'publisher',
  'album_artist',
  'composer',
  'TYER',
  'TMED',
  'comment',
  'TFLT',
  'encoded_by',
  'encoder',
  'copyright',
  'TOPE'
 */