
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
        {
            email = email.toLowerCase();
        }
          
        process.nextTick(function() {
            const bearerHeader = req.headers['authorization'];
            var userToken = null;
    
            if(typeof bearerHeader !== 'undefined'){
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
    
                jwt.verify(bearerToken, 'geheim', (err, data) => {
                    if(err)
                    {
                    }
                    else{
                     userToken = data;
                    }
                });
            }

            if (!userToken) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
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

            } else if (!userToken.user.local ) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    console.log(user);
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, "Email is already in use");

                    } else {
                        User.findById(userToken.user._id, function(err, user)
                    
                    {
                    
                        if(err)
                        return done(err);

                        if(user)
                        {
                            user.local.email = email;
                            user.local.password = password;
                            user.save(function (err) {
                                if (err)
                                    return done(err);
                                
                                    jwt.sign({user: user}, 'geheim', (err, token) =>{
                                        if(err)
                                            return done(null, false, "Not logged in");
                                        
                                        return done(null, user, token);
                                    }); 
                            });
                        }
                    })                        
                    }
                });
            } else {
                return done(null, true);
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
            const bearerHeader = req.headers['authorization'];
            var userToken = null;
    
            if(typeof bearerHeader !== 'undefined'){
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
    
                jwt.verify(bearerToken, 'geheim', (err, data) => {
                    if(err)
                    {
                    }
                    else{
                     userToken = data;
                    }
                });
            }

            if (!userToken) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase();
                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                   
                            });
                        }

                        jwt.sign({user: user}, 'geheim', (err, token) =>{
                            if(err)
                                return done(null, false, "Not logged in");
                            
                            return done(null, user, token);
                        }); 
                        
                    } else {
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                                jwt.sign({user: newUser}, 'geheim', (err, token) =>{
                                    if(err)
                                        return done(null, false, "Not logged in");
                                    
                                    return done(null, newUser, token);
                                }); 
                        });
                    }
                });

            } else {
        
                User.findById(userToken.user.id, function(err, user)
                    {
                        if(err)
                        return done(err);

                        if(user)
                        {
                            user.google.id = profile.id;
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase();
            
                            user.save(function(err) {
                                if (err){
                                    return done(err);
                                }
                                    
                                jwt.sign({user: user}, 'geheim', (err, token) =>{
                                    if(err)
                                        return done(null, false, "Not logged in");
                                    
                                    return done(null, user, token);
                                }); 
                            });
                        }
                    })         
            }

        });

    }));
}
