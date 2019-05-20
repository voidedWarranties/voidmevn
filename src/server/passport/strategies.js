import { Strategy as LocalStrategy } from "passport-local";

import User from "../User";

export default passport => {
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
                        newUser.twofactor.enabled = false;
    
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
};