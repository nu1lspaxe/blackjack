const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.MODE ?? 'development';

/** @type {import("webpack").Configuration} */
const config = {
    entry: './src/client/index.tsx',
    mode,

    output: {
        filename: 'index.js',
        path: path.resolve('public')
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: ['swc-loader']
            },
            {
                test: /\.css$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    {
                        loader: 'css-loader', options: {
                            modules: {
                                auto: true,
                                localIdentName: mode == "development" ? '[file]_[local]' : '[hash:base64]'
                            },
                            esModule: true,
                            importLoaders: 2,
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                oneOf: [
                    {
                        resourceQuery: /react/,
                        loader: '@svgr/webpack',
                    },
                    {
                        type: 'asset/resource'
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/resource'
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],

        alias: {
            "@/client": path.resolve('src/client')
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
            filename: 'index.html'
        }),
        new MiniCSSExtractPlugin({
            filename: 'styles.css',
        })
    ]
}

module.exports = config;