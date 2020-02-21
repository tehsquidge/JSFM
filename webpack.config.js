const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
    entry: {
        Analyser: './src/js/synth/Analyser.js',
        Chorus: './src/js/synth/Chorus.js',
        Delay: './src/js/synth/Delay.js',
        Operator: './src/js/synth/Operator.js',
        Reverb: './src/js/synth/Reverb.js',
        Voice: './src/js/synth/Voice.js',
        VoicePool: './src/js/synth/VoicePool.js',
        MIDI: './src/js/synth/MIDI/MidiInputDevice.js',
        Utils: './src/js/utils/index.js',
        AnalyserModule: "./src/js/ui-components/AnalyserModule.jsx",
        ChorusModule: "./src/js/ui-components/ChorusModule.jsx",
        DelayModule: "./src/js/ui-components/DelayModule.jsx",
        OperatorModule: "./src/js/ui-components/OperatorModule.jsx",
        ProgrammingModule: "./src/js/ui-components/ProgrammingModule.jsx",
        ReverbModule: "./src/js/ui-components/ReverbModule.jsx",
        VolumeModule: "./src/js/ui-components/VolumeModule.jsx",
        index: './src/js/index.jsx'

    },
    output: {
        path: path.join(__dirname, './www/'),
        filename: 'js/[name].js',
    },
    watch:true,
    devtool: 'eval-source-map',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/
        },
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets:[
                  ["@babel/preset-react"],
                  [
                    "@babel/env",
                    {
                      useBuiltIns: "entry",
                      corejs: 3,
                    }
                  ]
                ]
              }
            }
        },
        {
            test:/\.(s*)css$/,
            use:[MiniCssExtractPlugin.loader,'css-loader', 'sass-loader']
        },{
            test: /\.(png|jp(e*)g|svg)$/,  
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'images/'
                }
            }]
        },{
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,  
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts/'
                }
            }]
        },{
            test: /\.?schema.json$/,
            type: 'javascript/auto',
            use: [{
                loader: 'ajv-pack-loader',
                options: {
                  ajv: {
                    // Pass any Ajv constructor options here
                    allErrors: true
                  }
                }
            }]
        }
    ]
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        title: "JSFM JavaScript FM Synthesizer",
        favicon: "./icon.png"
      })
    ],
    optimization: {
        runtimeChunk: 'single',
        minimizer: [
            new UglifyJsPlugin({
              uglifyOptions: {
                output: {
                  comments: false,
                },
              },
            }),
          ],
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
    
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              },
            },
          },
        },
      },
};

module.exports = config;