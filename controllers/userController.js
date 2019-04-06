var mongoose = require('mongoose');
var User = require('../models/user');
var express = require('express');
var jwt = require('jsonwebtoken');

    exports.getLogout = function(req,res,next){
        if(req.verifiedUser)
        {
          res.clearCookie('token');
          res.redirect('/login');
        }
        else{
          res.redirect('/login');
        }
      }

      exports.getLogin = function(req,res,next){

        if(req.verifiedUser)
        {
          res.redirect('/profile');
        }
        else{
          res.render('user/login',{layout:false});
        }  
      }

    exports.getSignUp = function(req,res,next)
    {
        res.render('user/signin',{layout:false});
    }

    exports.getProfile = function(req, res, next)
    {
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
    }

    exports.unlinkLocal = function(req, res, next)
    {
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
                data.save(function(err) {
                    if(err)
                    {
                        console.log(err);
                    }
                } );   
                req.updatedUser = data;             
            }
            next(); 
        });
        } 
        else
        {
            next();
        }   
    }

    exports.getConnectLocal = function(req, res) {
        res.render('user/localconnect', {layout:false});
    }

    exports.unlinkFacebook = function(req, res, next) {
        
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
                data.save(function(err) {
                    if(err)
                    console.log(err);
                } );   
                req.updatedUser = data;             
              }
              next(); 
           });
          } 
          else{
            next();
          }   
    }

    exports.unlinkGoogle = function(req, res, next) {
        
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
                data.save(function(err) {
                    if(err)
                    {
                        console.log(err);
                    }
                } );   
                req.updatedUser = data;             
              }
              next(); 
           });
          } 
          else{
            next();
        }   
    }
    


    