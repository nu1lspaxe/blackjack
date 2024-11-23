const path = require('path');

const mode = process.env.MODE ?? 'development';

/** @type {import("webpack").Configuration} */
const config = {
    entry: {
        index: './src/index.ts',
        instrumentation: './src/instrumentation.ts'
    },

    mode,
    target: 'node',

    output: {
        filename: '[name].js',
        path: path.resolve('dist')
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: ['swc-loader']
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],

        alias: {
            "@": path.resolve('src')
        }
    }
}

module.exports = config;