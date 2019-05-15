import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";

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
                test: /\.(js|vue)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
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
        extensions: [".js", ".vue"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/index.html"
        }),
        new FaviconsWebpackPlugin("./config/logo.png")
    ]
};

export default clientConfig;