var readline = require('readline'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

rl.setPrompt('>', 1);
//rl.prompt();

exports.readline = rl;

exports.datediff = function(fromDate, toDate, interval) {
    /*
     * DateFormat month/day/year hh:mm:ss
     * ex.
     * datediff('01/01/2011 12:00:00','01/01/2011 13:30:00','seconds');
     */
    var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    var timediff = toDate - fromDate;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
    case "years":
        return toDate.getFullYear() - fromDate.getFullYear();
    case "months":
        return (
        (toDate.getFullYear() * 12 + toDate.getMonth()) - (fromDate.getFullYear() * 12 + fromDate.getMonth()));
    case "weeks":
        return Math.floor(timediff / week);
    case "days":
        return Math.floor(timediff / day);
    case "hours":
        return Math.floor(timediff / hour);
    case "minutes":
        return Math.floor(timediff / minute);
    case "seconds":
        return Math.floor(timediff / second);
    default:
        return undefined;
    }
}