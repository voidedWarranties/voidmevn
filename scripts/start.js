import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";

import config from "../config/webpack.dev";

const options = {
    contentBase: "../dist",
    hot: true,
    host: "localhost",
    proxy: {
        "/api": "http://localhost",
        "/signup": "http://localhost",
        "/login": "http://localhost"
    },
    historyApiFallback: true,
    disableHostCheck: true
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(3001, "localhost", () => {

});