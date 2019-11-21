const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    mode: 'development',

    target: 'node',

    entry: './src/ts/main.ts',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    // webpack-dev-serverを立ち上げた時のドキュメントルートを設定
    devServer: {
        contentBase: './public/index.html'
    },
    module: {
        // babel-loaderの設定
        rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }],
                exclude: /node_modules/,
            },
            // html
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            // SASS取り込み設定
            {
                test: /\.scss/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
            // typescript
            {
                // 拡張子 .ts の場合
                test: /\.ts$/,
                // TypeScript をコンパイルする
                use: "ts-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ],
    // import 文で .ts ファイルを解決するため
    resolve: {
        extensions: [".ts"]
    }
};