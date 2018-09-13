var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        'metalheadz': './src/examples/metalheadz/Application.ts',
        'portals': './src/examples/portals/Application.ts',
        'torus': './src/examples/torus/Application.ts',
        'twister': './src/examples/twister/Application.ts',
        'lens': './src/examples/lens/Application.ts',
        'plasma': './src/examples/plasma/Application.ts',
        'metaballs': './src/examples/metaballs/Application.ts',
        'razor': './src/examples/razor/Application.ts',
        'roto-zoomer': './src/examples/roto-zoomer/Application.ts',
        'voxel-landscape': './src/examples/voxel-landscape/Application.ts',
        'cube': './src/examples/cube/Application.ts',
        'bobs': './src/examples/bobs/Application.ts',
        'starfield': './src/examples/starfield/Application.ts',
        'hoodlum': './src/examples/hoodlum/Application.ts',
        'misc': './src/examples/misc/Application.ts',
        'baked-lighting': './src/examples/baked-lighting/Application.ts',
        'platonian': './src/examples/platonian/Application.ts',
        'gears': './src/examples/gears/Application.ts',
        'led-plasma': './src/examples/led-plasma/Application.ts',
        'particle-streams': './src/examples/particle-streams/Application.ts',
        'moving-torus': './src/examples/moving-torus/Application.ts',
        'torus-knot-tunnel': './src/examples/torus-knot-tunnel/Application.ts',
        'planedeformation-tunnel': './src/examples/planedeformation-tunnel/Application.ts',
        'torus-knot': './src/examples/torus-knot/Application.ts',
        'textured-torus': './src/examples/textured-torus/Application.ts',
        'particle-torus': './src/examples/particle-torus/Application.ts',
        'toxic-dots': './src/examples/toxic-dots/Application.ts',
        'flood-fill': './src/examples/flood-fill/Application.ts',
        'rotating-gears': './src/examples/rotating-gears/Application.ts',
        'abstract-cube': './src/examples/abstract-cube/Application.ts',
        'frustum-culling': './src/examples/frustum-culling/Application.ts',
        'titan-effect': './src/examples/titan-effect/Application.ts',
        'sine-scroller': './src/examples/sine-scroller/Application.ts'
    },
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
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
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['lens'],
            filename: 'lens.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['plasma'],
            filename: 'plasma.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['metaballs'],
            filename: 'metaballs.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['razor'],
            filename: 'razor.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['roto-zoomer'],
            filename: 'roto-zoomer.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['voxel-landscape'],
            filename: 'voxel-landscape.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['cube'],
            filename: 'cube.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['bobs'],
            filename: 'bobs.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['starfield'],
            filename: 'starfield.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['hoodlum'],
            filename: 'hoodlum.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['misc'],
            filename: 'misc.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['baked-lighting'],
            filename: 'baked-lighting.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['platonian'],
            filename: 'platonian.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['gears'],
            filename: 'gears.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['led-plasma'],
            filename: 'led-plasma.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['particle-streams'],
            filename: 'particle-streams.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['moving-torus'],
            filename: 'moving-torus.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['torus-knot-tunnel'],
            filename: 'torus-knot-tunnel.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['planedeformation-tunnel'],
            filename: 'planedeformation-tunnel.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['torus-knot'],
            filename: 'torus-knot.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['textured-torus'],
            filename: 'textured-torus.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['particle-torus'],
            filename: 'particle-torus.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['toxic-dots'],
            filename: 'toxic-dots.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['flood-fill'],
            filename: 'flood-fill.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['rotating-gears'],
            filename: 'rotating-gears.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['abstract-cube'],
            filename: 'abstract-cube.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['frustum-culling'],
            filename: 'frustum-culling.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['titan-effect'],
            filename: 'titan-effect.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['sine-scroller'],
            filename: 'sine-scroller.html'
        })
    ]
}
