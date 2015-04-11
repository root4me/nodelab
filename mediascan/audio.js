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
                play(file,to,parseInt(to) + parseInt(data));
            });
        })
        .run();
}

play('samples/mumbai.effect.mp3', 0, 10);
