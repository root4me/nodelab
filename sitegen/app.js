var sitegen = require('./sitegen');

/*
console.log(sitegen.config);

var payload = sitegen.drafts();
sitegen.sort(payload);


for (var i = 0; i < payload.length; i++) {
    sitegen.generatepost(payload[i],i == payload.length -1 ?  null : payload[i + 1],  i > 0 ? payload[i - 1] : null);
}

sitegen.copyimgs();
*/

sitegen.rebuildall();
