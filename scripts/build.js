import webpack from "webpack";

import config from "../config/webpack.prod";

const compiler = webpack(config);

compiler.run((err, stats) => {
    if(err) console.error(err);
});