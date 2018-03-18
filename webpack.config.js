var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

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
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpg|mp3|ogg)$/,
                use: 'file-loader'
            }
        ]
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        /**
         * Removed minification due to sourcemap generation problems
         */
        // new MinifyPlugin()
    ]
}
