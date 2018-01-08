module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({
    concat: {
      build: {
        src: [
                'js/src/header.js',
                'js/src/prototypes/*.js',
                'js/src/prototypes/MIDI/*.js',
                'js/src/main.js'
             ],
        dest: 'www/js/main.js',
        nonull: true
     }
    },
    nwjs: {
      options: {
          platforms: ['win64','osx64','linux64'],
          buildDir: './bin/', // Where the build version of my NW.js app is saved
          flavour: 'normal'
      },
      src: ['./www/**/*'] // Your NW.js app
    },
    watch: {
        js: {
            files: ['js/src/**/*.js'],
            tasks: ['build']
        }
    }    
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nw-builder');




  grunt.registerTask(
      'build',
      'Build the app into the www folder',
      [ 'concat' ]
 );
  grunt.registerTask(
    'compile',
    'compile out to nwjs builds',
    [ 'build','nwjs' ]
);


};
