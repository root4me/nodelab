var utils = require('./utils'),
    activities = [],
    commands = ['exit', 'help', 'list', 'update', 'add', 'delete', 'commit'],
    uuid = require('node-uuid');

var rl = utils.readline;

var socket = require('./sockets');

rl.on('line', function(input) {
    if (commands.indexOf(input.trim()) < 0) {
        if (activities.length > 0) {
            completeCurrentActivity();
        }
        var activity = {
            id: uuid.v1(),
            name: input,
            startTime: new Date(),
            endTime: new Date(),
            duration: 0
        };
        activities.push(activity);
        //Need to evaluate if this need to be a commit or something like notify
        socket.emit('commit',activity);
        displayCurrentActivity();
    }
    else {
        //completeCurrentactivity();
        processCommand(commands[commands.indexOf(input.trim())]);
        displayCurrentActivity();
    }
});

function completeCurrentActivity() {
    var activity = activities[activities.length - 1];
    if ((activity !== undefined) && (utils.datediff(activity.startTime, activity.endTime, "seconds") < 1)) {
        activity.endTime = new Date();
        activity.duration = utils.datediff(activity.startTime, activity.endTime, "seconds");
        socket.emit('commit', activity);
    }
}
function addActivity(activity)
{

}

function deleteActivity(position)
{
    var activity = activities[position];
    socket.emit('delete',activity);
    activities.splice(position, 1);
}

function processCommand(command) {
    switch (command) {
    case 'exit':
        console.log('exit');
        break;
    case 'help':
        console.log('help');
        completer();
        break;
    case 'list':
        for (var i = 0; i < activities.length; i++) {
            process.stdout.write((i + 1) + '.. ');
            console.log(activities[i]);
        }
        break;

    case 'delete':
        rl.question("position : ", function(data) {
            var position = data - 1;
            //rl.write(activity.name + ' , ' + activity.startTime  + ' , ' + activity.endTime);
            process.stdout.write('delete (y/n) ?');
            rl.question('delete activity "' + activities[position].name + '" (y/n) ? ', function(data) {
                if (data.match(/^y(es)?$/i)) {
                    deleteActivity(position);
                }
                rl.prompt();
            });
        });
        break;

    case 'update':
        rl.question("position : ", function(data) {
            //rl.write(activities[data].toString());
            var activity = activities[data - 1];
            rl.write(activity.name + ' , ' + activity.startTime + ' , ' + activity.endTime);
            rl.question('.... ', function(data) {
                var newactivity = data.split(',');
                activity.name = newactivity[0].trim();
                activity.startTime = new Date(newactivity[1]);
                activity.endTime = new Date(newactivity[2]);
                activity.duration = utils.datediff(activity.startTime, activity.endTime, "seconds");

                rl.prompt();

            });
        });
        break;
    case 'add':
        rl.question("position : ", function(data) {
            //rl.write(activities[data].toString());
            var activity = activities[data - 1];
            rl.question('activity Name >', function(data) {
                console.log('inside modified :' + data);
                activities.splice(1, 0, {
                    name: data,
                    startTime: new Date(),
                    endTime: new Date(),
                    duration: 0
                });
                rl.prompt();
            });
        });
        break;

    case 'commit':
        console.log('... sending that list to server');
        completeCurrentActivity();
        if (socket.connected() === true) {
            for (var j = 0; j < activities.length; j++) {
                console.log(activities[j]);
                socket.emit('commit', {
                    id: activities[j].id,
                    name: activities[j].name,
                    startTime: activities[j].startTime,
                    endTime: activities[j].endTime,
                    duration: activities[j].duration
                });
            }
            activities.splice(0, activities.length);
        }
        else {
            console.log('not connected to server');
        }
        break;
    }
//    rl.prompt();
}

function completer(line) {
    var completions = commands;
    var hits = completions.filter(function(c) {
        return c.indexOf(line) === 0;
    });

    // show all completions if none found
    return [hits.length ? hits : completions, line];
}

function displayCurrentActivity() {
    if (activities.length > 0) {
        if (utils.datediff(activities[activities.length - 1].startTime, activities[activities.length - 1].endTime, "seconds") === 0) {
            console.log('.... working on : ' + activities[activities.length - 1].name);
        }
    }
    else {
        console.log('.... apparently you are not working on any activity ');
    }
    rl.prompt();
}
