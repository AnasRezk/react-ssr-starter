const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const fg = require('fast-glob');

const { getAppEnv } = require('./env');

const env = getAppEnv();
const { PUBLIC_URL = '' } = env.raw;
const resolvePath = relativePath => path.resolve(__dirname, relativePath);

// base paths
const javascriptSrcPath = resolvePath('../src');
const entryPointsGlobPattern = '*.(js|jsx|ts|tsx)';
const entryFiles = fg.sync(path.join(javascriptSrcPath, entryPointsGlobPattern));

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    // entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&reload=true', resolvePath('../src/index.js')],
    entry: (function() {
        const entry = {};

        entryFiles.forEach(file => {
            const fileBasename = path.basename(file, path.extname(file));
            const entryArr = ['webpack-hot-middleware/client?path=/__webpack_hmr&reload=true'];

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
        // path: resolvePath('../build'),
        // filename: '[name].bundle.js',
        filename: path.join('[name].bundle.js'),
        path: resolvePath('../build'),
        chunkFilename: '[name].chunk.js',
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
                    cacheDirectory: true
                }
            },
            {
                test: /\.s?css$/,
                exclude: [resolvePath('../src/styles')],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            camelCase: true,
                            modules: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: ['last 2 versions', 'not ie < 11'],
                                    flexbox: 'no-2009'
                                })
                            ]
                        }
                    },
                    'sass-loader',
                    'import-glob-loader'
                ]
            },
            {
                test: /\.s?css$/,
                include: [resolvePath('../src/styles')],
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: ['last 2 versions', 'not ie < 11'],
                                    flexbox: 'no-2009'
                                })
                            ]
                        }
                    },
                    'sass-loader',
                    'import-glob-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new webpack.DefinePlugin(env.forWebpackDefinePlugin),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new LodashModuleReplacementPlugin(),
        new ErrorOverlayPlugin(),
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
