var HtmlWebpackPlugin = require('html-webpack-plugin');
var BabiliPlugin = require('babili-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        application: './src/Application.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: './src/tsconfig.json'
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.png$/,
                loader: 'file-loader'
            },
                {
                test: /\.mp3$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
      // new BabiliPlugin()
    ]
}