var ffmpeg = require('fluent-ffmpeg');

// Add/update metadata to audio file
// ffmpeg -i samples/Mumbai_Effect.mp3 -metadata title="mumbai.effect"  samples/mumbai.effect.mp3 -y


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


// play audio
// ffmpeg -i samples/mumbai.effect.mp3 -f alsa hw:0
/*
ffmpeg({
  source: 'samples/mumbai.effect.mp3',
  // set a custom [winston](https://github.com/flatiron/winston) logging instance (optional, default null which will cause fluent-ffmpeg to spawn a winston console logger)
  logger: null,
})
.output('samples/mumbai.effect.mp3')
.outputOptions('-f alsa hw:0')
.run();
*/