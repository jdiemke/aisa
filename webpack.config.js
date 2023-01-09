const path = require('path');
const webpackUtils = require('./webpack-utils/webpack.utils');

module.exports = {
    mode: webpackUtils.getMode(),
    entry: webpackUtils.getEntryPoints(),
    devtool: "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, './dist'),
        },
        compress: true,
        port: 8080,
        client: {
            progress: true,
        },
        open: false
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            "path": false,
            "crypto": false,
            "path-browserify": false
        }
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 8000000,
        maxEntrypointSize: 8000000
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.(png|jpg|mp3|ogg|md2|mdl|tga|xm|obj|rocket|jsx)$/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: webpackUtils.getWebpackPlugins()
}
