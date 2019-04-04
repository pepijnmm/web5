var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var conf = require('./auth');
var jwt = require('jsonwebtoken');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase();

        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if(!user)
                {
                   return done(null, false, "No user found");
                }
                if(!user.validPassword(password))
                {
                    return done(null, false, "Wrong password");
                }
                else{
                    jwt.sign({user: user}, 'geheim', (err, token) =>{
                        if(err)
                            return done(null, false, "Not logged in");
                        
                        return done(null, user, token);
                    }); 
                } 
            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
    
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err){
                        return done(err);
                    }
                        
                    if (user) {
                        return done(null, false, "email taken");
                    } else {
                        var nUser = new User();
                        nUser.local.email = email;
                        nUser.local.password = password; 

                        nUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, nUser, "Succesful");
                        });
                    }
                });

            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,user);
                        });
                    }
                });
            } else {
                return done(null, req.user);
            }

        });

    }));

    passport.use(new GoogleStrategy({

        clientID: conf.googleAuth.clientID,
        clientSecret: conf.googleAuth.clientSecret,
        callbackURL: conf.googleAuth.callbackURL,
        passReqToCallback: true

    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase();
                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, user);
                });

            }

        });

    }));
}
