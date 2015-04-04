var Ffmpeg = require('fluent-ffmpeg');


// recursively scan directory and look at each file 

// figure out if the file is a video , audio or image

// if the file is a compressed file, snoop into the compressed file and see if there is media files inside that 

// once the above can be done, expand the program to categorize and move files into catrgory based directories

// for the unncategorizable media files, programatically set tags to catrgorize based on criteria

var fs = require('fs');

var search = function(dir) {

  if (!fs.existsSync(dir)) {
    return console.log('dir doesnt exist : ' + dir);
  }

  //console.log("dir -> " + dir);

  var files = fs.readdirSync(dir),
    path;

  for (var i = 0; i < files.length; i++) {
    path = dir + '/' + files[i];

    if (fs.statSync(path).isDirectory()) {
      search(path);
    }
    else {
      //console.log("file -> " + path)
      filetype(path, function(filename , header) { console.log(filename + " -> " + header); });
    }

  }
};


  
var filetype = function(file, callback) {

  fs.open(file, 'r', function(err, fd) {
    if (err) {
      console.log(err.message);
      return;
    }
    var buffer = new Buffer(50);
    
    fs.read(fd, buffer, 0, 50, 0, function(err, bytesRead, buffer) {
      //console.log("file -> " + file + " -> " + buffer.toString('hex'));
      callback(file , buffer.toString('hex'));
    });
  });


}

search(process.argv[2]);



/*
Ffmpeg.getAvailableFormats(function(err, formats) {
  console.log('Available formats:');
  console.dir(formats);
});
*/


/*

Ffmpeg.ffprobe('~/Downloads/Path to Follow.mp3', function(err, metadata) {
    console.dir(metadata);
});


Ffmpeg.ffprobe('~/Downloads/Path to Follow.mp3',function(metadata, err) {
  console.log(require('util').inspect(metadata, false, null));
});

*/