import merge from "webpack-merge";
import common from "./webpack.common";
import path from "path";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";


const prodClientConfig = {
    mode: "production",
    devtool: "source-map",
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false
                }
            }
        }),
        new HardSourceWebpackPlugin(),
        new CompressionPlugin({
            test: /\.js$/
        })
        // new BundleAnalyzerPlugin()
    ]
};

// const serverConfig = {
//     mode: "production",
//     target: "node",
//     entry: "./src/server/server.js",
//     output: {
//         path: path.join(__dirname, "../dist/server"),
//         filename: "server_bundle.js"
//     },
//     node: {
//         __dirname: false
//     }
// };

export default merge(common, prodClientConfig);