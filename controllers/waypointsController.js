var mongoose = require('mongoose');
var Waypoint = require('../models/waypoint');
var Race = require('../models/race');
var express = require('express');

exports.get = function(req, res, next) {
  var query = {};

	if(req.params._id){
		query._id = req.params._id;
  } 
  
  var result = Waypoint.find(query)
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
exports.getRace = function(req, res, next) {
  var query = {};

  if(req.params._oldid){
    query._id = req.params._oldid;
  }
  var result = Race.find(query);
  result.then(data => {
    if (data[0].waypoints.length > 0) {
      arr = [];
      data[0].waypoints.forEach(element => {
        arr.push(element)
      });
      var result = Waypoint.where('_id').in( arr)
         .byPage(req.query.pageIndex, req.query.pageSize);

      result.then(data => {
        if (req.params._id) {
          data = data[0];
        }

        return res.render('waypoint/index',{data: data});
      }).catch(err => {
        console.log(err);
        res.status(err.status || 500);
        res.render('error');
      });
    }
    else{
      res.render('error');
    }
  });
}
exports.post = function(req, res, next) {
  var waypoint = new Waypoint(req.body);
  waypoint.save(function(err)
  {
   //duplicate key
  if ( err && err.code === 11000 ) {
    res.json(201, 'error', 'Waypoint already exists');
    return;  
  }
  
  if(err)
    {
        console.log(err);
      res.status(err.status || 500);
      res.render('error');
    }
    else{
      return res.json(waypoint);
    }});
  }

  exports.delete = function(req, res, next)
  {
      Waypoint.findByIdAndDelete(req.params._id, function(err){
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
    Waypoint.findByIdAndUpdate(req.params._id, req.body, {new: true}, (err, race) =>
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
