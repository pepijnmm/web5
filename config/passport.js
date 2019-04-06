
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var conf = require('./auth');
var jwt = require('jsonwebtoken');

module.exports = function(passport) {
    
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
                    user.local['password']=null;
                    jwt.sign({user: user}, 'geheim', (err, token) =>{
                        if(err)
                            return done(null, false, "Not logged in");
                        
                        return done(null, token, null);
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
            const bearerToken = req.cookies['token']; 
            var userToken = null;
    
            if(typeof bearerToken !== 'undefined'){
                jwt.verify(bearerToken, 'geheim', (err, data) => {
                    if(err)
                    {
                        return done(err)
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
                            {
                            
                                return done(err);
                            }
                                
                            return done(null, nUser, "Succesful");
                        });
                    }
                });

            } else if (!userToken.user.local ) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                   
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
                        
                            var hash = user.hashPassword(password);
                            user.local.email = email;
                            user.local.password = hash;
                            user.save(function (err) {
                                if (err)
                                    return done(err);
                                
                                    jwt.sign({user: user}, 'geheim', (err, token) =>{
                                        if(err)
                                            return done(null, false, "Not logged in");
                                        
                                        return done(null, token, null);
                                    }); 
                            });
                        }
                    })                        
                    }
                });
            } else {
                return done(null, bearerToken);
            }

        });

    }));

    var fbStrategy = conf.facebookAuth;
    fbStrategy.passReqToCallback = true;
    passport.use(new FacebookStrategy(fbStrategy,
    function(req, token, refreshToken, profile, done) {

        process.nextTick(function() {
            const bearerToken = req.cookies['token']; 
            var userToken = null;
    
            if(typeof bearerToken !== 'undefined'){
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
            
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                       
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                            });
                        }

                        jwt.sign({user: user}, 'geheim', (err, token) =>{
                            if(err)
                                return done(null, false, "Not logged in");
                            
                            return done(null, token, null);
                        }); 

                    } else {
                    
                        var newUser = new User();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                                jwt.sign({user: newUser}, 'geheim', (err, token) =>{
                                    if(err)
                                        return done(null, false, "Not logged in");
                                    
                                    return done(null, token, null);
                                }); 
                        });
                    }
                });

            } else {
            
                User.findOne({'_id' : userToken.user._id}, function(err, user)
                {
                    if(err)
                    return done(err);

                    if(user)
                    {
                        User.findOne({ 'facebook.email' : (profile.emails[0].value || '').toLowerCase()}, function(err, email)
                        {
                            if(email)
                            {
                                return done(null, bearerToken, "You are logged in, tried to link accounts: This facebook account has already been linked to a account");
                            }
                            else{
                        
                                user.facebook.id = profile.id;
                                user.facebook.token = token;
                                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                
                                user.save(function(err) {
                                    if (err)
                                        return done(err);
                                        
                                     jwt.sign({user: user}, 'geheim', (err, token) =>{
                                        if(err)
                                            return done(null, false, "Not logged in");
                                        
                                        return done(null, token, null);
                                    }); 
                                });
                            }
                        })
                    }
                    else{
                        return done(null, false, "User not found");
                    }
                });
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
            const bearerToken = req.cookies['token']; 
            var userToken = null;
    
            if(typeof bearerToken !== 'undefined'){
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
                            
                            return done(null, token, null);
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
                                    
                                    return done(null, token, null);
                                }); 
                        });
                    }
                });

            } else {
            
                User.findById(userToken.user._id, function(err, user)
                    {
                        if(err)
                        return done(err);

                        if(user)
                        {
                            User.findOne({ 'google.email' : (profile.emails[0].value || '').toLowerCase()}, function(err, email){
                                if(err)
                                {return done(err)}

                                if(email)
                                {
                                    return done(null, bearerToken, "You are logged in, tried link accounts: This google account has already been linked to a account");
                                }
                                else{
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
                                            
                                            return done(null, token, null);
                                        }); 
                                    });
                                }
                            })                    
                        }
                    })         
            }

        });

    }));
}
