const HtmlWebpackPlugin = require('html-webpack-plugin');
const examples = require('../webpack.example-list');

module.exports.getMode = () => process.env.NODE_ENV == "production" ? "production" : "development";

module.exports.getEntryPoints = () => {
    let entryPoints = {};
    examples.forEach(example => entryPoints[example.name] = example.path);
    return entryPoints;
};

module.exports.getHtmlWebpackPlugins = () => examples.map(example => new HtmlWebpackPlugin({
    template: example.template != undefined ? example.template : './src/index.html',
    chunks: [example.name],
    filename: `${example.name}.html`
}));
