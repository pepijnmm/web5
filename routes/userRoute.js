var jwt = require('jsonwebtoken');
var User = require('../models/user');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);
var userController = require('../controllers/userController');

    router.get('/login', userController.isVerified, userController.getLogin);
    router.post('/login', userController.login);
    router.get('/logout', userController.isVerified, userController.getLogout);
    router.get('/profile', userController.isVerified, userController.getProfile);
    router.get('/signup', userController.getSignUp);
    router.post('/signup', userController.signup);

    router.get('/unlink/facebook', userController.isVerified, userController.unlinkFacebook, userController.updateJWT);
    router.get('/unlink/google', userController.isVerified, userController.unlinkGoogle, userController.updateJWT);
    router.get('/unlink/local', userController.isVerified, userController.unlinkLocal, userController.updateJWT);

    router.get('/connect/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    router.get('/connect/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    router.get('/connect/local', userController.getConnectLocal);
    router.post('/connect/local', userController.connectLocal);

    router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    router.get('/auth/google/callback', userController.googleCallback);
    router.get('/auth/facebook/callback', userController.facebookCallback);
    module.exports = router;
