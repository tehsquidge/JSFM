var path = require('path');

var config = {
    entry: './src/js/index.jsx',
    output: {
        path: path.join(__dirname, './www/'),
        filename: 'js/main.js'
    },
    watch:true,
    devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ["babel-loader"]
        },
        {
            test:/\.(s*)css$/,
            use:['style-loader','css-loader', 'sass-loader']
        },{
            test: /\.(png|jp(e*)g|svg)$/,  
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'images/'
                }
            }]
        }]
    }
};

module.exports = config;