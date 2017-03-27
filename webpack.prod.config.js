var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
    	alias: {
		'vue$': 'vue/dist/vue.js'
		}
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            test: /(\.js|\.vue)$/,
            compress: {
                warnings: false
            },
            comments: false
        })
    ]
}
