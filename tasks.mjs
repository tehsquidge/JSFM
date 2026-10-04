import nwbuild from 'nw-builder';
import fs from 'fs';
import deepmerge from 'deepmerge';
import initPreset from "./src/js/initPreset.mjs";

// nw-builder 4 builds one platform per call. Icons are per-platform formats:
// linux takes a path inside the app (www/), osx an .icns, win an .ico (we have none).
const targets = [
    { platform: 'osx', arch: 'x64', icon: './icon.icns' },
    { platform: 'win', arch: 'x64', icon: '' },
    { platform: 'linux', arch: 'x64', icon: 'icon.png' }
];

async function build(){
    for (const { platform, arch, icon } of targets) {
        await nwbuild({
            mode: 'build',
            version: 'stable',
            srcDir: './www',
            glob: false,
            outDir: `./bin/${platform}-${arch}`,
            platform,
            arch,
            app: { name: 'JSFM', icon }
        });
    }
    console.log('all done!');
}

function updatePresets(){
    const presetDir = "./presets/";
    fs.readdir(presetDir, function (err, files) {
        if (err) {
          console.error("Could not list the directory.", err);
          process.exit(1);
        }

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

