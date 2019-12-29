var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devtool: 'cheap-source-map',
    devServer: {
        port: 3000,
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'dev')
    },
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, 'dev')
    },
    watch: true,
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['vendor', 'main'],
            chunksSortMode: 'manual',
            hash: false
        }),
        new CopyPlugin([
            { from: 'node_modules/phaser/plugins/spine/dist/SpinePlugin.js', to: 'plugins/SpinePlugin.js' },
            { from: 'assets', to: 'assets' }
        ])
    ],
    module: {
        rules: [
            { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') }
        ]
    }
}