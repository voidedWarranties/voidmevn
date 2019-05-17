import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";

import config from "../config/webpack.dev";
import fs from "fs";
import path from "path";

const options = {
    contentBase: "../dist",
    hot: true,
    host: "localhost",
    proxy: {
        "/api": "http://localhost",
        "/signup": "http://localhost",
        "/login": "http://localhost",
        "/logout": "http://localhost"
    },
    historyApiFallback: true,
    disableHostCheck: true,
    // https: {
    //     key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")),
    //     cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem"))
    // }
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(3001, "localhost", () => {

});