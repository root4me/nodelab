var fileman = require('./fileman');

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
var sortById = function(list){
        list.sort(function(a, b) {
        if (parseFloat(a.draftId) > parseFloat(b.draftId)) return -1;
        if (parseFloat(a.draftId) < parseFloat(b.draftId)) return 1;
        if (parseFloat(a.draftId) == parseFloat(b.draftId)) return 0;
    });
};

var findById = function(list,id){
    return list.filter(function(o){
        return o.draftId == "2";
    })
}

sortById(drafts);

console.log(drafts);

/*
drafts.forEach(function(draft) {
    fileman.createPost(draft);
});
*/