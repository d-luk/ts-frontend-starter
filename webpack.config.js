const path = require('path');
const pj = path.join;
const fs = require('fs');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { ModuleConcatenationPlugin, UglifyJsPlugin } = require('webpack').optimize;

const env = (process.env.NODE_ENV || 'production').trim();
const isProd = env === 'production';

console.log('Webpack env:', env);

const config = {
    entry: './src/scripts/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'script.js',
        devtoolModuleFilenameTemplate: './scripts/[resource-path]'
    },
    target: 'web',
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            enforce: 'pre',
            use: 'tslint-loader'
        }, {
            test: /\.ts$/,
            use: ['ts-loader']
        }]
    },
    plugins: isProd
        ? [
            new CircularDependencyPlugin({ failOnError: true }),
            new ModuleConcatenationPlugin(),
            new UglifyJsPlugin({
                sourceMap: true,
                compress: { passes: 3 },
                mangle: { properties: true },
                comments: false,
                parallel: true
            })
        ]
        : [
            new CircularDependencyPlugin()
        ],
    devtool: isProd ? 'source-map' : 'inline-source-map'
};

module.exports = config;