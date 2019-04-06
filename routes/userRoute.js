var jwt = require('jsonwebtoken');
var User = require('../models/user');
var mongoose = require('mongoose');
var userController = require('../controllers/userController');

module.exports = function(app, passport) {
  

    app.get('/login', userController.isVerified, userController.getLogin);
    app.post('/login', userController.login);
    app.get('/logout', userController.isVerified, userController.getLogout);
    app.get('/profile', userController.isVerified, userController.getProfile);
    app.get('/signup', userController.getSignUp);
    app.post('/signup', userController.signup);

    app.get('/unlink/facebook', userController.isVerified, userController.unlinkFacebook, userController.updateJWT);
    app.get('/unlink/google', userController.isVerified, userController.unlinkGoogle, userController.updateJWT);
    app.get('/unlink/local', userController.isVerified, userController.unlinkLocal, userController.updateJWT);

    app.get('/connect/google', passport.authenticate('google', { scope : ['profile', 'email'] })); 
    app.get('/connect/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    app.get('/connect/local', userController.getConnectLocal);
    app.post('/connect/local', userController.connectLocal);

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback', userController.googleCallback);
    app.get('/auth/facebook/callback', userController.facebookCallback);


     
    
    

  
    
 
    

}
