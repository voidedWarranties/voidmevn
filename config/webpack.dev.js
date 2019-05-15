import merge from "webpack-merge";
import common from "./webpack.common";
import webpack from "webpack";

const devClientConfig = {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};

export default merge(common, devClientConfig);