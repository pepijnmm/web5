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

        console.log('prof');
        console.log(req.verifiedUser);

        if(req.verifiedUser)
        {
          console.log('render');
          return res.render('user/profile', {layout:false, data: req.verifiedUser});
        }
        else{
          res.redirect('/login');
        }
      });

      app.get('/unlink/local', isVerified, function(req, res, next) {
        
        var user = req.verifiedUser.user;       
  
        if(user && user.local)
          {
           User.findById(user._id, function(err, data){
              if(err)
              {
                res.redirect('/profile');
              }
              
              if(data.local)
              {
                data.local.email = undefined;
                data.local.password = undefined;
                data.save(function(err) {} );   
                req.updatedUser = data;             
              }
              next(); 
           });
          } 
          else{
            next();
          }   
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

          console.log(info);
          res.cookie('token', info)
          res.redirect('/profile');
        })(req, res, next);
      });

      app.get('/unlink/google', isVerified, function(req, res, next) {
        
        var user = req.verifiedUser.user;       
  
        if(user && user.google)
          {
           User.findById(user._id, function(err, data){
              if(err)
              {
                res.redirect('/profile');
              }
              
              if(data.google)
              {
                data.google.token = undefined;
                data.google.email = undefined;
                data.save(function(err) {} );   
                req.updatedUser = data;             
              }
              next(); 
           });
          } 
          else{
            next();
          }   
    }, updateJWT);

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
      
      if(user)
      {
        jwt.sign({user: user}, 'geheim', (err, token) =>{
          if(err)
              res.redirect('/profile');
  
              res.cookie('token', token);
              res.redirect('/profile');
        }); 
      }else{
        res.redirect('/profile');
      }   
    }
}
