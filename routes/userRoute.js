var jwt = require('jsonwebtoken');
var User = require('../models/user');
var mongoose = require('mongoose');

module.exports = function(app, passport) {
  

    app.get('/login', isVerified, function(req,res,next){

      if(req.verifiedUser)
      {
        res.redirect('/profile');
      }
      else{
        res.render('user/login',{layout:false});
      }  
    });

    app.get('/logout', isVerified, function(req,res,next){
      if(req.verifiedUser)
      {
        res.clearCookie('token');
        res.redirect('/login');
      }
      else{
        red.redirect('/login');
      }
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
          if (err) {
            return res.render('user/login', {layout:false, message: err});  
           }
          if (!user) {
              return res.render('user/login', {layout:false, message: info});  
          }
          res.cookie('token', user)
          res.redirect('/profile');
        })(req, res, next);
      });

      app.get('/profile', isVerified, function(req, res, next) {
        
        if(req.verifiedUser)
        {
          if(req.query.message)
          {
            return res.render('user/profile', {layout:false, data: req.verifiedUser, message: req.query.message});
          }
          else{
            return res.render('user/profile', {layout:false, data: req.verifiedUser});
          }
         
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
          if (err) return res.render('user/signin', {layout:false, message: err});  
          if (!user) return res.render('user/signin', {layout:false, message: info});  

          return res.redirect('/login');
        })(req, res, next);
      });

      app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

      app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
          if (err) {
            return res.render('user/login', {layout:false, message: err});  
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

    app.get('/connect/local', function(req, res) {
        res.render('user/localconnect', {layout:false});
    });

    app.post('/connect/local', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return res.render('user/localconnect', {layout:false, message: err});  
         }
        if (!user) {
            return res.render('user/localconnect', {layout:false, message: info});  
        }
        res.cookie('token', user)
        res.redirect('/profile');
      })(req, res, next);
    });

      app.get('/connect/google', passport.authenticate('google', { scope : ['profile', 'email'] })); 

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
                data.google.id = undefined;
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

    app.get('/unlink/facebook', isVerified, function(req, res, next) {
        
      var user = req.verifiedUser.user;       

      if(user && user.facebook)
        {
         User.findById(user._id, function(err, data){
            if(err)
            {
              res.redirect('/profile');
            }
            
            if(data.facebook)
            {
              data.facebook.token = undefined;
              data.facebook.id = undefined;
              data.facebook.email = undefined;
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


    

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    app.get('/auth/facebook/callback', function(req, res, next) {
      passport.authenticate('facebook', function(err, user, info) {
        if (err) {
          return res.render('user/login', {layout:false, message: err});  
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

    app.get('/connect/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    
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
