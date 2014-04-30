
var fileman = require('./fileman');

var drafts = fileman.getDraftFiles('draft');

console.log(drafts);

for (var i = 0 ; i < drafts.length; i++)
{
    fileman.createPost(drafts[i]);
}

console.log(drafts);
