import NwBuilder from 'nw-builder';
import fs from 'fs';
import deepmerge from 'deepmerge';

import initPreset from "./src/js/initPreset.mjs";
function build(){
    const nw = new NwBuilder({
        buildDir: './bin/',
        files: './www/**/**', // use the glob format
        macIcns: './icon.icns',
        platforms: ['osx64', 'win64','linux64'],
        appName: 'JSFM'
    });

    nw.on('log',  console.log);

    nw.build().then(function () {
    console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });

}

function updatePresets(){
    const presetDir = "./presets/";
    fs.readdir(presetDir, function (err, files) {
        if (err) {
          console.error("Could not list the directory.", err);
          process.exit(1);
        }
        console.log('yeeeehawwwwww...');

        files.forEach(function (file, index) {
            const fullPath = presetDir.concat(file);
            const preset = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            const fixedPreset = deepmerge(initPreset,preset);
            
            fs.writeFileSync(fullPath,JSON.stringify(fixedPreset));

        });

    });
}


switch(process.argv[2]){
    case 'build':
        build();
    break;
    case 'updatePresets':
        updatePresets();
    break;
}

