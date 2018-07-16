const NwBuilder = require('nw-builder');


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


switch(process.argv[2]){
    case 'build':
        build();
    break;
}

