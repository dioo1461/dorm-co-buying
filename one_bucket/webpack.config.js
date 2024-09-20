const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { useReducer } = require('react')
const webpack = require('webpack')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: path.resolve(__dirname, './public/index.html'),
    filename: 'index.html',
    inject: 'body',
})

const tsxLoader = {
    test: /\.(tsx|js|ts)$/,
    exclude: /node_modules\/(?!()\/).*/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-typescript', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
        },
    },
}

const imageLoader = {
    test: /\.(png|jpe?g|gif)$/i,
    use: [
        {
            loader: 'file-loader',
            options: {
                useRelativePath: true,
                name: '[sha512:hash:base64:7].[ext]',
                limit: 4096,
                outputPath: 'img/',
                publicPath: '/',
            },
        },
    ],
}

const svgLoader = {
    test: /\.svg$/,
    use: {
        loader: 'file-loader',
        options: {
            useRelativePath: true,
            name: '[sha512:hash:base64:7].[ext]',
            outputPath: 'img/',
            publicPath: '/',
        },
    },
}

module.exports = {
    target: 'web',
    entry: path.join(__dirname, 'index.web.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/build'),
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            fs: false,
        },
        alias: {
            'react-native$': 'react-native-web',
            'react-native-encrypted-storage':
                '@react-native-async-storage/async-storage',
        },
        extensions: ['.web.js', '.js', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [tsxLoader, imageLoader, svgLoader],
    },
    plugins: [
        HTMLWebpackPluginConfig,
        new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(true), // __DEV__ 변수를 전역적으로 정의
        }),
        new NodePolyfillPlugin(),
    ],
    devServer: {
        open: true,
        historyApiFallback: true,
        static: path.join(__dirname, 'public'),
        compress: true,
        port: 8080,
    },
}
