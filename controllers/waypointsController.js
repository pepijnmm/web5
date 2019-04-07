var mongoose = require('mongoose');
var Waypoint = require('../models/waypoint');
var Race = require('../models/race');
var express = require('express');
var User = require('../models/user');
var unirest = require('unirest');

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
exports.posts = function(req, res, next) {
  if(req.body.bars != undefined && req.body.bars.length > 0 && req.params._oldid != undefined) {
    var i = 0;
    if(!Array.isArray(req.body.bars)){
      req.body.bars = [req.body.bars];
    }
    var result = Race.findById(req.params._oldid);
    result.then(data => {
      var i = data.waypoints.length;
      req.body.bars.forEach((data2)=>{
        data.waypoints.push(data2);
        data.save();
        var waypoint = new Waypoint({_id: data2, order: ++i});
        i++;
        waypoint.save(function (err) {
        });
      });
      return res.json(true);
    });
  }
}
exports.check = function(req, res, next) {
  var user = req.verifiedUser.user;
  user = User.findById(user._id);
  user.then(user_data => {
    if(!user_data.waypoints.includes(req.params._oldid + '.' + req.params._id)) {
      res.io.emit("socketToMe", "users");
      getLocation([req.params._id]).then((waypoints)=>{
        waypoints.forEach((point)=> {
          res.io.to('user').emit(req.params._oldid + "_waypoint", 'iemand is langs '+point.tags.name+' gekomen');
          res.io.to('admin').emit(req.params._oldid + "_waypoint", 'iemand met het id: '+user_data.id + ' is langs '+point.tags.name+' gekomen');
        });

      });
      user_data.waypoints.push(req.params._oldid + '.' + req.params._id);
      user_data.save();
      return res.json(true);
    }
    else{
      return res.status(500);
    }
  });
}
function getLocation(number) {
  const stcafes = "https://overpass-api.de/api/interpreter?data=[out:json];";
  query = "";
  number.forEach((data) => {
    query+="node(id:"+data+");out;";
  })
  return new Promise((resolve, reject) => {
    unirest.get(stcafes + query)
        .end(function (result) {
          if (result.body.elements != null && result.body.elements.length > 0) {
            resolve(result.body.elements);
          } else {
            resolve([]);
          }

        });
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
