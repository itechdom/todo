'use strict';
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/javascript/index.js',
    },
    output: {
        filename: 'bundle.js',
    },
    module: {
        rules: [
        {
            test: /\.js$/, //Check for all js files
            use: [{
                loader: 'babel-loader'
            }]
        },
        {
            test: /\.(css|sass|scss)$/, //Check for sass or scss file names
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ]
        },
        {
            test: /\.json$/,
            loader: "json-loader"  //JSON loader
        },
        {
            test: /\.(jpg|png)$/,
            loader: "file-loader"  //JSON loader
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file-loader?name=public/fonts/[name].[ext]'
        }
        ]
    }
};
