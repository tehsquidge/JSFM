const fs = require('fs');
var glob = require("glob")
const concat = require('concat');
var NwBuilder = require('nw-builder');



function concatFiles(){
    var output = "";

    ['js/src/header.js',
    'js/src/prototypes/*.js',
    'js/src/prototypes/MIDI/*.js',
    'js/src/main.js'].forEach( path => {
        glob.sync(path).forEach(f => {
            output += fs.readFileSync(f);
        });
    });
    return output;
}

function build(){
    var nw = new NwBuilder({
        buildDir: './bin/',
        files: './www/**/**', // use the glob format
        platforms: ['osx64', 'win64','linux64'],
    });

    nw.on('log',  console.log);

    nw.build().then(function () {
    console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });

}

function write(output){
    fs.writeFileSync('./www/js/main.js',output);
}

switch(process.argv[2]){
    case 'concat':
        var output = concatFiles();
        write(output);
    break;
    case 'build':
        var output = concatFiles();
        write(output);
        build();
    break;
}

