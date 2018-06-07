'use strict';

const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const BabiliPlugin = require('babel-minify-webpack-plugin');
const {styles} = require('@ckeditor/ckeditor5-dev-utils');
const buildConfig = require('./build-config');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src', 'ckeditor.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'ckeditor.js',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: buildConfig.moduleName
    },
    plugins: [
        new CKEditorWebpackPlugin({
            language: buildConfig.config.language
        }),
        new BabiliPlugin(null, {
            comments: false
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['raw-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            singleton: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig({
                            themeImporter: {
                                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                            },
                            minify: true
                        })
                    }
                ]
            }
        ]
    }
};
