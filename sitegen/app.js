var fileman = require('./fileman');

// get the drafts
var drafts = fileman.getDraftFiles('draft');


for (var i = 0; i < drafts.length; i++) {
    //fileman.getMetadata('d');
    fileman.createPost(drafts[i]);

}

//fileman.getLinks(drafts[i]);

//console.log(JSON.stringify(drafts));

//fileman.saveMetadata(drafts);

