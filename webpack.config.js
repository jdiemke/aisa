var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        application: './src/Application.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}