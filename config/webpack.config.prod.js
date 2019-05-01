const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fg = require('fast-glob');

const { getAppEnv } = require('./env');

const env = getAppEnv();
const { PUBLIC_URL = '' } = env.raw;
const resolvePath = relativePath => path.resolve(__dirname, relativePath);

if (env.raw.NODE_ENV !== 'production') {
    throw new Error('Production builds must have NODE_ENV=production.');
}

// base paths
const javascriptSrcPath = resolvePath('../src');
const entryPointsGlobPattern = '*.(js|jsx|ts|tsx)';
const entryFiles = fg.sync(path.join(javascriptSrcPath, entryPointsGlobPattern));

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: (function() {
        const entry = {};

        entryFiles.forEach(file => {
            const fileBasename = path.basename(file, path.extname(file));
            const entryArr = [resolvePath('../src/app/polyfills.js')];

            entryArr.push(path.resolve(__dirname, file));
            if (env && env.app) {
                if (env.app === fileBasename) {
                    entry[fileBasename] = entryArr;
                }
            } else {
                entry[fileBasename] = entryArr;
            }
        });

        return entry;
    })(),
    output: {
        path: resolvePath('../build'),
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: PUBLIC_URL + '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: eslintFormatter
                        },
                        loader: 'eslint-loader'
                    }
                ],
                include: resolvePath('../src')
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: resolvePath('../src'),
                loader: 'babel-loader',
                options: {
                    compact: true
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ]
    },
    plugins: [
        new webpack.DefinePlugin(env.forWebpackDefinePlugin),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new LodashModuleReplacementPlugin(),
        new ManifestPlugin({
            fileName: 'asset-manifest.json'
        }),
        new ReactLoadablePlugin({
            filename: 'build/react-loadable.json'
        })
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
