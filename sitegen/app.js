var fileman = require('./fileman');

var sitegen = require('./sitegen');


console.log(sitegen.config);

var payload = sitegen.drafts();
sitegen.sort(payload);
console.log(payload);

//console.log(conf.drafts(conf.config));

/*
// Get the drafts
var drafts = fileman.getDraftFiles('draft');

var sortBycreateDate = function(list) {
    // Sort the payload newest create date first
    list.sort(function(a, b) {
        if (Date.parse(a.createDate) > Date.parse(b.createDate)) return -1;
        if (Date.parse(a.createDate) < Date.parse(b.createDate)) return 1;
        if (Date.parse(a.createDate) == Date.parse(b.createDate)) return 0;
    });
}

//Sort by ascending Id
var sortById = function(list) {
    list.sort(function(a, b) {
        if (parseFloat(a.draftId) > parseFloat(b.draftId)) return -1;
        if (parseFloat(a.draftId) < parseFloat(b.draftId)) return 1;
        if (parseFloat(a.draftId) == parseFloat(b.draftId)) return 0;
    });
};

var findById = function(list, id) {
    return list.filter = (function(o) {
        return o.draftId == "2";
    })
}

sortById(drafts);

//console.log(drafts);

for (var i = 0; i < drafts.length; i++) {
    if (drafts.length > (i + 1)) {
        drafts[i].prevPage = drafts[i + 1].publishFile;
        drafts[i].prevPageTitle = drafts[i + 1].title;
        drafts[i + 1].nextPage = drafts[i].publishFile;
        drafts[i + 1].nextPageTitle = drafts[i].title;
    }
    console.log(drafts[i]);
}

*/

/*
drafts.forEach(function(draft) {
    fileman.createPost(draft);
});
*/