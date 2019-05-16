import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VueLoaderPlugin from "vue-loader/lib/plugin";

const clientConfig = {
    entry: "./src/client/index.js",
    output: {
        path: path.join(__dirname, "../dist/client"),
        filename: "index_bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|vue)$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 8192
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/index.html",
            favicon: "./config/logo.png",
            title: "voidmevn"
        }),
        new VueLoaderPlugin()
    ]
};

export default clientConfig;