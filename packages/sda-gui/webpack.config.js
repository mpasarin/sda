
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        mode: 'development',
        entry: './src/main.ts',
        target: 'electron-main',
        module: {
            rules: [{
                test: /\.tsx?$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        output: {
            path: __dirname + '/dist',
            filename: 'main.js'
        }
    },
    {
        mode: 'development',
        entry: './src/app/ReactApp.tsx',
        target: 'electron-renderer',
        devtool: 'source-map',
        module: {
            rules: [{
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        output: {
            path: __dirname + '/dist/app',
            filename: 'reactApp.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/app/index.html'
            })
        ]
    }
];