var fileman = require('./fileman');

// Get the drafts
var drafts = fileman.getDraftFiles('draft');

// Sort the payload newest create date first
drafts.sort(function(a, b) {
    if (Date.parse(a.createDate) > Date.parse(b.createDate)) return -1;
    if (Date.parse(a.createDate) < Date.parse(b.createDate)) return 1;
    if (Date.parse(a.createDate) == Date.parse(b.createDate)) return 0;
});

console.log(drafts);

drafts.forEach(function(draft) {
    fileman.createPost(draft);
});
