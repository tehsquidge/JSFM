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
        dest: 'js/main.js',
        nonull: true
     }
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





  // define the tasks
  grunt.registerTask(
      'build',
      'BUILD BUILD BUILD!!!!',
      [ 'concat' ]
  );

};
