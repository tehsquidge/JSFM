var path = require('path');

var config = {
    entry: './js/src/',
    output: {
        path: path.join(__dirname, './www/js/'),
        filename: 'main.js'
    }
}

module.exports = config;