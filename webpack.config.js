// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const webpack = require('atool-build/lib/webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// const __DEV__ = process.env.NODE_ENV !== 'production'
module.exports = function(webpackConfig) {
    webpackConfig.babel.plugins.push('transform-runtime')
    webpackConfig.babel.plugins.push(['import', {
        libraryName: 'antd',
        style: 'css', // if true, use less
    }])

    // Enable this if you have to support IE8.
    // webpackConfig.module.loaders.unshift({
    //   test: /\.jsx?$/,
    //   loader: 'es3ify-loader',
    // })

    // Parse all less files as css module.
    webpackConfig.module.loaders.forEach(function(loader, index) {
        if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
            loader.test = /\.dont\.exist\.file/;
        }
        if (loader.test.toString() === '/\\.module\\.less$/') {
            loader.test = /\.less$/;
        }
    });

    webpackConfig.module.loaders.push({
        test: /\.(ico|png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        loader: 'url'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url'
        })
    webpackConfig.alias = {
        'images': path.resolve(__dirname, 'src/images/')
    }
    // Load src/entries/*.js as entry automatically.
    const files = glob.sync('./src/entries/*.js');
    const newEntries = files.reduce(function(memo, file) {
        const name = path.basename(file, '.js')
        memo[name] = ['babel-polyfill',file]
        return memo;
    }, {});
    webpackConfig.entry = Object.assign({}, webpackConfig.entry, newEntries)
    return webpackConfig
}
