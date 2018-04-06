'use strict';

const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const {styles} = require('@ckeditor/ckeditor5-dev-utils');
const buildConfig = require('./build-config');
const path = require('path');
const file = 'ck.' + process.env.editor + '.js';

module.exports = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src', file),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: file,
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: buildConfig.moduleName
    },
    plugins: [
        new CKEditorWebpackPlugin({
            languages: [buildConfig.language]
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
