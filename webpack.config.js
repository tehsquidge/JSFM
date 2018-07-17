var path = require('path');

var config = {
    entry: './js/src/index.jsx',
    output: {
        path: path.join(__dirname, './www/js/'),
        filename: 'main.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]
    }
};

module.exports = config;