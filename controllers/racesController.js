var mongoose = require('mongoose');
var Race = require('../models/race');
var express = require('express');

exports.get = function(req, res, next) {
  var query = {};

	if(req.params._id){
		query._id = req.params._id;
  } 
  
  var result = Race.find(query)
  .byPage(req.query.pageIndex, req.query.pageSize);

  result.then(data => {
    if(req.params._id)
    {
      data = data[0];
    }

    return res.json(data);
    }).catch(err => {
      console.log(err);
      res.status(err.status || 500);
      res.render('error');
    });
  }

exports.post = function(req, res, next) {
  var race = new Race(req.body);
  race.save(function(err)
  {
   //duplicate key
  if ( err && err.code === 11000 ) {
    res.json(201, 'error', 'Race already exists');
    return;  
  }
  
  if(err)
    {
      console.log(err);
      res.status(err.status || 500);
      res.render('error');
    }
    else{
      return res.json(race);
    }});
  }

  exports.delete = function(req, res, next)
  {
      Race.findByIdAndDelete(req.params._id, function(err){
        if(err)
        {
          console.log(err);
          res.status(err.status || 500);
          res.render('error');
        }
        else{
          res.status(200);
          res.send();
        }
      })
  }

  exports.edit = function(req, res, next)
  {
    Race.findByIdAndUpdate(req.params._id, req.body, {new: true}, (err, race) =>
    {
      if(err)
      {
        console.log(err);
        res.status(500);
        res.send();
      }
      else
      {
        return res.json(race);
      }
    });
  }
    
 
