const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');

let baseConfig = {
    entry: {
        background: './src/background.js',
        options: './src/options.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    stats: {
        colors: true,
        errorDetails: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, './src/img'),
                    to: path.join(__dirname, './dist/img')
                },
                {
                    from: path.join(__dirname, './src/manifest.json'),
                    to: path.join(__dirname, './dist/manifest.json')
                },
                {
                    from: path.join(__dirname, './src/options.html'),
                    to: path.join(__dirname, './dist/options.html')
                }
            ]
        })
    ]
}

module.exports = baseConfig
