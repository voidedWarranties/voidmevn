import express from "express";
import expressStaticGzip from "express-static-gzip";
import session from "express-session";
import bodyParser from "body-parser";
import { redirectToHTTPS } from "express-http-to-https";
import history from "connect-history-api-fallback";

import api_route from "./routes/api";
import account_route from "./routes/account";

import http from "http";
import https from "https";

import path from "path";
import fs from "fs";

import passport from "passport";

import mongoose from "mongoose";

import setup from "./passport/setup";
import strategies from "./passport/strategies";

const MongoStore = require("connect-mongo")(session);

const app = express();

mongoose.connect("mongodb://localhost:27017/voidmevn", {
    useNewUrlParser: true
});

const store = new MongoStore({
    mongooseConnection: mongoose.connection
});

app.use(session({
    secret: "yourmotheraoisdfuoahoefiq2hwefasdofjisaodf",
    resave: true,
    saveUninitialized: true,
    store
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

const privateKey = fs.readFileSync(path.join(__dirname, "../../certs/key.pem"));
const certificate = fs.readFileSync(path.join(__dirname, "../../certs/cert.pem"));

const credentials = { key: privateKey, cert: certificate };

if(process.env.NODE_ENV === "production") {
    app.use(redirectToHTTPS([], [], 301));
    
    app.get("*.js", (req, res, next) => {
        req.url = `${req.url}.gz`;
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/javascript");
        next();
    });

    app.use(express.static(path.join(__dirname, "../client")));
    app.use(expressStaticGzip(path.join(__dirname, "../client")));

    app.use(history({
        disableDotRule: true,
        rewrites: [
            { from: "/account/logout", to: "/account/logout" }
        ]
    }));

    app.use(express.static(path.join(__dirname, "../client")));
    app.use(expressStaticGzip(path.join(__dirname, "../client")));
}

setup(passport);
strategies(passport);

app.use("/api", api_route);

app.use("/account", account_route(passport));

const httpServer = http.createServer(app);

httpServer.listen(80, "0.0.0.0");

if(process.env.NODE_ENV === "production") {
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, "0.0.0.0");
}