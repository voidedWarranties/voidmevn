import express from "express";
import expressStaticGzip from "express-static-gzip";
import path from "path";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./User";
import flash from "connect-flash";

import mongoose from "mongoose";
import session from "express-session";

import history from "connect-history-api-fallback";

import fs from "fs";
import http from "http";
import https from "https";

import bodyParser from "body-parser";

import { redirectToHTTPS } from "express-http-to-https";

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

app.use(flash());
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
            { from: "/logout", to: "/logout" }
        ]
    }));

    app.use(express.static(path.join(__dirname, "../client")));
    app.use(expressStaticGzip(path.join(__dirname, "../client")));
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},
(req, email, password, done) => {
    if(email) email = email.toLowerCase();
    process.nextTick(() => {
        if(!req.user) {
            User.findOne({ "local.email": email }, (err, user) => {
                if(err) return done(err);

                if(user) {
                    return done(null, false);
                } else {
                    let newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(err => {
                        if(err) return done(err);

                        return done(null, newUser);
                    });
                }
            });
        } else {
            return done(null, req.user);
        }
    });
}));

passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},
(req, email, password, done) => {
    if(email) email = email.toLowerCase();

    process.nextTick(() => {
        User.findOne({ "local.email": email }, (err, user) => {
            if(err) return done(err);

            if(!user) {
                return done(null, false);
            }

            if(!user.validPassword(password)) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        });
    });
}));

app.get("/api", (req, res) => {
    res.json(req.user);
});

app.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/sign-up"
}));

app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/log-in"
}));

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/log-in");
});

const httpServer = http.createServer(app);

httpServer.listen(80, "0.0.0.0");

if(process.env.NODE_ENV === "production") {
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, "0.0.0.0");
}