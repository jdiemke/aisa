const path = require('path');
const webpackUtils = require('./webpack-utils/webpack.utils');

module.exports = {
    mode: webpackUtils.getMode(),
    entry: webpackUtils.getEntryPoints(),
    devtool: webpackUtils.getMode() === 'production' ? false : 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, './dist'),
        },
        compress: true,
        port: 9000,
        hot: true,
        liveReload: true,
        watchFiles: {
            paths: ['src/**/*', 'webpack.config.js', 'webpack.example-list.js'],
            options: {
                usePolling: true,
                interval: 500,
                ignored: /node_modules/
            }
        },
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
        },
        alias: {
            '@assets': path.resolve(__dirname, './src/assets'),
            '@core': path.resolve(__dirname, './src/core'),
            '@effects': path.resolve(__dirname, './src/effects'),
            '@examples': path.resolve(__dirname, './src/examples'),
        },
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
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, './src/tsconfig.json')
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|mp3|ogg|md2|mdl|tga|xm|obj|mtl|rocket|jsx|mod|s3m|it|mptm|glb)$/,
                type: 'asset/resource',
                generator: {
                    filename: ({ filename }) => {
                        const sourcePath = path.relative(path.resolve(__dirname, './src'), path.resolve(__dirname, filename));
                        return `assets/${sourcePath.split(path.sep).join('/').replace(/^assets\//, '')}`;
                    }
                }
            }
        ]
    },
    plugins: webpackUtils.getWebpackPlugins()
}
