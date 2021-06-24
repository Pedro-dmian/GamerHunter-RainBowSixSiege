const
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyPlugin = require("copy-webpack-plugin"),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    OverwolfPlugin = require('./overwolf.webpack'),
    HtmlWebPackPartialsPlugin = require('html-webpack-partials-plugin'),
    webpack = require('webpack');
    // NodePolyfillPlugin = require("node-polyfill-webpack-plugin"),
    // nodeExternals = require('webpack-node-externals');

let minify = {
    html5: true,
    collapseWhitespace: true,
    caseSensitive: true,
    removeComments: true,
    removeEmptyElements: true
}

module.exports = env => ({
    entry: {
        background: './src/typescript/controllers/BackgroundController.ts',
        desktop: './src/typescript/controllers/DesktopController.ts',
        in_game: './src/typescript/controllers/InGameController.ts'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.hbs$/i,
                loader: 'handlebars-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'assets'
            },
            {
                test: /\.(svg)$/i,
                type: 'assets/source'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: 'assets/js/[name].js'
    },
    // externals: [nodeExternals()],
    plugins: [
        // new NodePolyfillPlugin(),
        new CleanWebpackPlugin,
        new CopyPlugin({
            patterns: [ { from: "public", to: "./" } ],
        }),
        new HtmlWebpackPlugin({
            title: 'background',
            template: './src/html/background.hbs',
            filename: path.resolve(__dirname, './dist/background.html'),
            chunks: ['background']
            // minify
        }),
        new HtmlWebpackPlugin({
            title: 'desktop',
            template: './src/html/desktop.hbs',
            filename: path.resolve(__dirname, './dist/desktop.html'),
            chunks: ['desktop']
            // minify
        }),
        new HtmlWebpackPlugin({
            template: './src/html/in_game.hbs',
            filename: path.resolve(__dirname, './dist/in_game.html'),
            chunks: ['in_game']
            // minify
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new OverwolfPlugin(env)
    ]
})
