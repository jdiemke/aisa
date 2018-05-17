var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        metalheadz: './src/examples/metalheadz/Application.ts',
        portals: './src/examples/portals/Application.ts',
        torus: './src/examples/torus/Application.ts',
        twister: './src/examples/twister/Application.ts'
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
            template: './src/index.html',
            chunks: ['metalheadz'],
            filename: 'metalheadz.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['portals'],
            filename: 'portals.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['torus'],
            filename: 'torus.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['twister'],
            filename: 'twister.html'
        })
    ]
}
