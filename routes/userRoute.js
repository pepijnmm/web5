var jwt = require('jsonwebtoken');
var User = require('../models/user');
var mongoose = require('mongoose');
var userController = require('../controllers/userController');

module.exports = function(app, passport) {
  

    app.get('/login', isVerified, userController.getLogin);
    app.get('/logout', isVerified, userController.getLogout);
    app.get('/profile', isVerified, userController.getProfile);
    app.get('/signup', userController.getSignUp);

    app.get('/unlink/facebook', isVerified, userController.unlinkFacebook, updateJWT);
    app.get('/unlink/google', isVerified, userController.unlinkGoogle, updateJWT);
    app.get('/unlink/local', isVerified, userController.unlinkLocal, updateJWT);

    app.get('/connect/google', passport.authenticate('google', { scope : ['profile', 'email'] })); 
    app.get('/connect/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    app.get('/connect/local', userController.getConnectLocal);

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
          if (err) { 
            return res.render('user/login', {layout:false, message: err.message});  
           }
          if (!user) {
              return res.render('user/login', {layout:false, message: info});  
          }
          res.cookie('token', user)
          res.redirect('/profile');
        })(req, res, next);
      }); 
    
    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
          if (err) {
            return res.render('user/signin', {layout:false, message: err.message});}  
          if (!user) return res.render('user/signin', {layout:false, message: info});  

          return res.redirect('/login');
        })(req, res, next);
      });

    
    app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
          if (err) {
            return res.render('user/login', {layout:false, message: err.message});  
           }
          if (!user) {
              return res.render('user/login', {layout:false, message: info});  
          }
          res.cookie('token', user)
          
          if(info && Object.keys(info).length != 0)
          {
            res.redirect('/profile?message=' + info);
          }
          else{
            res.redirect('/profile');
          }
        })(req, res, next);
      });

    app.post('/connect/local', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return res.render('user/localconnect', {layout:false, message: err.message});  
         }
        if (!user) {
            return res.render('user/localconnect', {layout:false, message: info});  
        }
        res.cookie('token', user)
        res.redirect('/profile');
      })(req, res, next);
    });
 
    app.get('/auth/facebook/callback', function(req, res, next) {
      passport.authenticate('facebook', function(err, user, info) {
        if (err) {
          return res.render('user/login', {layout:false, message: err.message});  
         }
        if (!user) {
          
            return res.render('user/login', {layout:false, message: info});  
        }
        res.cookie('token', user)
        
        if(info && Object.keys(info).length != 0)
        {
          res.redirect('/profile?message=' + info);
        }
        else{
          res.redirect('/profile');
        }
      })(req, res, next);
    });

     function updateJWT(req, res, next){
      user = req.updatedUser;

      console.log("updated");
      console.log(user);

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
}
