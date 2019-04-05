var jwt = require('jsonwebtoken');
var User = require('../models/user');
var mongoose = require('mongoose');

module.exports = function(app, passport) {
  

    app.get('/login',function(req,res,next){res.render('user/login',{layout:false});});

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
          if (err) {
            return res.render('user/login', {layout:false, message: err});  
           }
          if (!user) {
              return res.render('user/login', {layout:false, message: info});  
          }
          res.cookie('token', info)
          res.redirect('/profile');
        })(req, res, next);
      });

      app.get('/profile', isVerified, function(req, res, next) { 
      
        if(req.verifiedUser)
        {
          return res.render('user/profile', {layout:false, data: req.verifiedUser});
        }
        else{
          res.redirect('/login');
        }
      });

      app.get('/unlink/local', isVerified, function(req, res, next) {
        
        var user = req.verifiedUser.user;

        newUser = User.findById(user._id, function(err, data){


        });

        
        console.log("nummer 1");
        console.log(newUser.lean());
        


        var newUser = null;
        if(user && user.local)
          {
           newUser = User.findById(user._id, function(err, data){
              if(err)
              {
                res.redirect('/profile');
              }
              
              if(data.local)
              {
                data.local.email = undefined;
                data.local.password = undefined;
                data.save(function(err) {} );   
                // req.updatedUser = newUser.toObjecT();  
              
              }
           });
          }    
        next();
    }, updateJWT);

    app.get('/signup',function(req,res,next){res.render('user/signin',{layout:false});});
    
    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
          if (err) { return res.json(err); }
          if (!user) { return res.json(info); }

          res.json(info);
        })(req, res, next);
      });

      app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
      app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
      app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
          if (err) {
            return res.render('user/login', {layout:false, message: err});  
           }
          if (!user) {
              return res.render('user/login', {layout:false, message: info});  
          }
          res.cookie('token', info)
          res.redirect('/profile');
        })(req, res, next);
      });

      function isVerified(req, res, next) {
        const bearerToken = req.cookies['token']; 
        var user = null;

        if(typeof bearerToken !== 'undefined'){
            jwt.verify(bearerToken, 'geheim', (err, data) => {
                if(err)
                {}
                else{
                  user = data;
                }
            });
        }
        req.verifiedUser = user;
        
        next();
    }

    function updateJWT(req, res, next){

        user = req.updatedUser;
        console.log("?sad??");
        console.log(user);

       jwt.sign({user: user}, 'geheim', (err, token) =>{
        if(err)
            callback(null);
        
            callback(token);
      }); 
    }
    
}
