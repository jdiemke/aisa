var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
	entry: {
		'third-person-camera': './src/examples/third-person-camera/Application.ts',
		'abstract-cube': './src/examples/abstract-cube/Application.ts',
		'baked-lighting': './src/examples/baked-lighting/Application.ts',
		'block-fade': './src/examples/block-fade/Application.ts',
		'bobs': './src/examples/bobs/Application.ts',
		'bump': './src/examples/bump-map/Application.ts',
		'bunny': './src/examples/bunny/Application.ts',
		'cinematic-scroller': './src/examples/cinematic-scroller/Application.ts',
		'cube-tunnel': './src/examples/cube-tunnel/Application.ts',
		'cube': './src/examples/cube/Application.ts',
		'demo': './src/examples/demo/Application.ts',
		'distorted-sphere': './src/examples/distorted-sphere/Application.ts',
        'dof-balls': './src/examples/dof-balls/Application.ts',
        'fire': './src/examples/fire/Application.ts',
		'flood-fill': './src/examples/flood-fill/Application.ts',
		'frustum-culling': './src/examples/frustum-culling/Application.ts',
		'gears-2': './src/examples/gears-2/Application.ts',
		'gears': './src/examples/gears/Application.ts',
		'hoodlum': './src/examples/hoodlum/Application.ts',
		'led-plasma': './src/examples/led-plasma/Application.ts',
		'lens': './src/examples/lens/Application.ts',
		'md2': './src/examples/md2/Application.ts',
		'mdl': './src/examples/mdl/Application.ts',
		'metaballs': './src/examples/metaballs/Application.ts',
		'metalheadz': './src/examples/metalheadz/Application.ts',
		'misc': './src/examples/misc/Application.ts',
		'mode-7': './src/examples/mode-7/Application.ts',
		'moving-torus': './src/examples/moving-torus/Application.ts',
		'other-md2': './src/examples/different-md2/Application.ts',
		'particle-streams': './src/examples/particle-streams/Application.ts',
		'particle-system': './src/examples/particle-system/Application.ts',
		'particle-torus': './src/examples/particle-torus/Application.ts',
		'pixel-effect': './src/examples/pixel-effect/Application.ts',
        'plane-deformation': './src/examples/plane-deformation/Application.ts',
        'plane-deformation-floor': './src/examples/plane-deformation-floor/Application.ts',
		'plane-deformation-tunnel': './src/examples/plane-deformation-tunnel/Application.ts',
		'plasma': './src/examples/plasma/Application.ts',
		'platonian': './src/examples/platonian/Application.ts',
		'polar-voxels': './src/examples/polar-voxels/Application.ts',
		'portals': './src/examples/portals/Application.ts',
		'razor': './src/examples/razor/Application.ts',
		'rotating-gears': './src/examples/rotating-gears/Application.ts',
		'roto-zoomer': './src/examples/roto-zoomer/Application.ts',
		'scrolling-background': './src/examples/scrolling-background/Application.ts',
		'sine-scroller': './src/examples/sine-scroller/Application.ts',
		'starfield': './src/examples/starfield/Application.ts',
		'textured-torus': './src/examples/textured-torus/Application.ts',
		'titan-effect': './src/examples/titan-effect/Application.ts',
		'torus-knot-tunnel': './src/examples/torus-knot-tunnel/Application.ts',
		'torus-knot': './src/examples/torus-knot/Application.ts',
		'torus': './src/examples/torus/Application.ts',
		'toxic-dots': './src/examples/toxic-dots/Application.ts',
		'tunnel': './src/examples/tunnel/Application.ts',
		'twister': './src/examples/twister/Application.ts',
		'voxel-balls': './src/examples/voxel-balls/Application.ts',
		'voxel-landscape-fade': './src/examples/voxel-landscape-fade/Application.ts',
		'voxel-landscape': './src/examples/voxel-landscape/Application.ts',
		'wavefront-texture': './src/examples/wavefront-texture/Application.ts',
		'wavefront': './src/examples/wavefront/Application.ts',
	},
	mode: 'development',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, './dist')
	},
	resolve: {
		extensions: ['.ts', '.js']
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 550000,
        maxEntrypointSize: 550000
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
				test: /\.(png|jpg|mp3|ogg|md2|mdl|tga|xm|obj|rocket|jsx)$/,
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
			chunks: ['voxel-landscape-fade'],
			filename: 'voxel-landscape-fade.html'
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
			template: './src/index-demo.html',
			chunks: ['demo'],
			filename: 'demo.html'
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
			chunks: ['fire'],
			filename: 'fire.html'
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
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['mode-7'],
			filename: 'mode-7.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['bump'],
			filename: 'bump.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['gears-2'],
			filename: 'gears-2.html'
        }),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['plane-deformation'],
			filename: 'plane-deformation.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['plane-deformation-floor'],
			filename: 'plane-deformation-floor.html'
        }),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['plane-deformation-tunnel'],
			filename: 'plane-deformation-tunnel.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['pixel-effect'],
			filename: 'pixel-effect.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['tunnel'],
			filename: 'tunnel.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['voxel-balls'],
			filename: 'voxel-balls.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['cube-tunnel'],
			filename: 'cube-tunnel.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['md2'],
			filename: 'md2.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['other-md2'],
			filename: 'other-md2.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['polar-voxels'],
			filename: 'polar-voxels.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['cinematic-scroller'],
			filename: 'cinematic-scroller.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['scrolling-background'],
			filename: 'scrolling-background.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['block-fade'],
			filename: 'block-fade.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['particle-system'],
			filename: 'particle-system.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['mdl'],
			filename: 'mdl.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['third-person-camera'],
			filename: 'third-person-camera.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['dof-balls'],
			filename: 'dof-balls.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['bunny'],
			filename: 'bunny.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['wavefront'],
			filename: 'wavefront.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['wavefront-texture'],
			filename: 'wavefront-texture.html'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			chunks: ['distorted-sphere'],
			filename: 'distorted-sphere.html'
		})
	]
}
