import { Router } from "express";

import User from "../User";

const router = new Router();

export default passport => {
    router.post("/signup", passport.authenticate("local-signup", {
        successRedirect: "/",
        failureRedirect: "/signup"
    }));

    router.post("/login", passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login"
    }));

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

    return router;
};