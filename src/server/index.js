import express from "express";
import expressStaticGzip from "express-static-gzip";
import path from "path";

const app = express();

if(process.env.NODE_ENV === "production") {
    app.get("*.js", (req, res, next) => {
        req.url = `${req.url}.gz`;
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/javascript");
        next();
    });

    app.use(express.static(path.join(__dirname, "../client")));
    app.use(expressStaticGzip(path.join(__dirname, "../client")));
}

app.get("/api", (req, res) => {
    res.json({a: "b"});
});

app.listen(80, "0.0.0.0", () => {
    console.log("Express Ready");
});