const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const examples = require('../webpack.example-list');

module.exports.getMode = () => process.env.NODE_ENV == "production" ? "production" : "development";

module.exports.getEntryPoints = () => {
    let entryPoints = {};
    examples.forEach(example => entryPoints[example.name] = example.path);
    return entryPoints;
};

module.exports.getWebpackPlugins = () => {
    // copy openmpt wasm
    let plug = [new CopyPlugin({
        patterns: [
            { from: "./src/sound/cowbell/openmpt", to: "openmpt" }
        ],
    })]
    // generate examples
    examples.forEach(example => {
        plug.push(new HtmlWebpackPlugin({
            template: example.template != undefined ? example.template : './src/index.html',
            chunks: [example.name],
            filename: `${example.name}.html`
        }))
    });

    // copy favicon
    plug.push( new HtmlWebpackPlugin({
        favicon: "./src/favicon.ico"
    }));

    return plug;
}
