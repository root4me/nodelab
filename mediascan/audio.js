var ffmpeg = require('fluent-ffmpeg');

// Add/update metadata to audio file
// ffmpeg -i samples/Mumbai_Effect.mp3 -metadata title="mumbai.effect"  samples/mumbai.effect.mp3 -y

/*
ffmpeg('samples/Mumbai_Effect.mp3')
.output('samples/mumbai.effect.mp3')
.outputOptions('-metadata title=mumbai.effect')
.on('end', function(err,data)
{
    if (err) {console.log (err); }
    console.log(data);
}
)
.run();
*/

// play audio for 20 seconds
// ffmpeg -i samples/mumbai.effect.mp3 -f alsa hw:0

var readline = require('readline'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

rl.setPrompt('>', 1);
rl.prompt();

var play = function(file, from, to) {

    ffmpeg(file)
        .seekInput(from)
        .duration(to - from)
        .output('hw:0')
        .outputOptions(['-f', 'alsa'])
        .on('end', function(err, data) {
            if (err) {
                console.log(err);
            }
            rl.question("Play some more (in seconds) : ", function(data) {
                if (parseInt(data) > 0) {
                    play(file, to, parseInt(to) + parseInt(data));
                }
                else {
                    displaymetadata(file);
                }
            });
        })
        .run();
}

var displaymetadata = function(file) {
    ffmpeg(file)
        .ffprobe(function(err, data) {
            console.log(data);
            rl.prompt();
        })
}

var updatemetadata = function(file, metadata) {
    ffmpeg(file)
        .output(file)
        .outputOptions(['-metadata', 'title=m.e'])
        .on('end', function(err, data) {
            if (err) {
                console.log(err);
            }
            //console.log(data);
            rl.prompt();
        })
        .run();

}

rl.on('line', function(input) {
    if (input.trim() == 'play') play('samples/mumbai.effect.mp3', 0, 10);
    if (input.trim() == 'display') displaymetadata('samples/mumbai.effect.mp3');
    if (input.trim().indexOf('update') == 0) {
        var tokens = input.split(' ');
        
        updatemetadata('samples/mumbai.effect.mp3', tokens[1]);
    };
    if (input.trim() == 'help') console.log('commands -> play display exit');
    if (input.trim() == 'exit') {
        rl.close();
        return;
    };
    rl.prompt();


});
