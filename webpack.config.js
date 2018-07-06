'use strict';

const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const buildConfig = require('./build-config');
const path = require('path');
const {styles} = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
    devtool: 'source-map',
    performance: {hints: false},
    entry: path.resolve(__dirname, 'cfg', 'ckeditor.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'ckeditor.js',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: buildConfig.moduleName
    },
    optimization: {
        minimizer: [
            new UglifyJsWebpackPlugin({
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        comments: /^!/
                    }
                }
            })
        ]
    },
    plugins: [
        new CKEditorWebpackPlugin({
            language: buildConfig.config.language
        })
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
