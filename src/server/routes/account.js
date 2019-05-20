import { Router } from "express";

import User from "../User";

import speakeasy from "speakeasy";
import crypto from "crypto";
import QRCode from "qrcode";

const encPass = "jsfaodijfoixjzoicfjawa";

const router = new Router();

export default passport => {
    router.post("/signup", passport.authenticate("local-signup", {
        successRedirect: "/",
        failureRedirect: "/signup"
    }));

    router.post("/login", (req, res, next) => {
        passport.authenticate("local-login", (err, user, info) => {
            if(err) return next(err);
            if(!user) return res.json({ success: false });

            if(user.twofactor.enabled) {
                res.json({
                    twofactor: true,
                    user
                });
            } else {
                req.logIn(user, err => {
                    if(err) return next(err);
                    res.json({
                        twofactor: true
                    });
                });
            }
        })(req, res, next);
    });

    router.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/login");
    });

    router.post("/changepass", (req, res) => {
        if(req.user) {
            User.findOne({ "local.email": req.user.local.email }, (err, user) => {
                if(err) console.error(err);

                if(user.validPassword(req.body.old)) {
                    user.local.password = user.generateHash(req.body.new);
                    user.save(err => {
                        if(err) console.error(err);
                        res.json({ success: true });
                    });
                }
            });
        }
    });

    router.post("/twofactor", async (req, res, next) => {
        const token = req.body.code;
        const decipher = crypto.createDecipher("aes-256-ctr", encPass);
        var user = await User.findOne({ "local.email": req.body.email });
        var secret = decipher.update(user.twofactor.key, "hex", "utf8");
        secret += decipher.final("utf8");

        const verified = speakeasy.totp.verify({ secret, encoding: "base32", token });

        if(verified) {
            passport.authenticate("local-login", (err, user, info) => {
                if(err) return next(err);
                if(!user) return res.redirect("/login");
                req.logIn(user, err => {
                    if(err) return next(err);
                    res.redirect("/");
                });
            })(req, res, next);
        }
    });

    router.post("/register_twofactor", (req, res) => {
        if(req.user) {
            User.findOne({ "local.email": req.user.local.email }, (err, user) => {
                if(err) console.error(err);

                if(user.validPassword(req.body.password)) {
                    user.twofactor.enabled = true;

                    var secret = speakeasy.generateSecret();

                    var cipher = crypto.createCipher("aes-256-ctr", encPass);

                    var encKey = cipher.update(secret.base32, "utf8", "hex");
                    encKey += cipher.final("hex");
                    user.twofactor.key = encKey;

                    user.save(err => {
                        if(err) console.error(err);

                        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
                            res.json({
                                key: secret.base32,
                                qr: data_url
                            });
                        });
                    });
                }
            });
        }
    });

    return router;
};