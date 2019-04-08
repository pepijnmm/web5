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
      req.body.bars.forEach((data2)=>{
        if(data.waypoints.indexOf(data2)<0) {
          data.waypoints.push(data2);
        }
        Waypoint.findById(data2).then((way)=> {
          if(way==null) {
            var waypoint = new Waypoint({_id: data2});
            waypoint.save(function (err) {
            });
          }
          else{
            return res.status(500);
          }
        });
      });
      data.save();
      return res.json(true);
    });
  }
}
exports.check = function(req, res, next) {
  var user = req.verifiedUser.user;
  user = User.findById(user._id);
  Waypoint.findById(req.params._id).then((waypoint)=>{
  if(waypoint != null){
  user.then(user_data => {
    if (!user_data.waypoints.includes(req.params._oldid + '.' + req.params._id)) {
      getLocation([req.params._id]).then((waypoints) => {
        waypoints.forEach((point) => {
          res.io.to('user').emit(req.params._oldid + "_waypoint", 'iemand is langs ' + point.tags.name + ' gekomen');
          res.io.to('admin').emit(req.params._oldid + "_waypoint", 'iemand met het id: ' + user_data.id + ' is langs ' + point.tags.name + ' gekomen');
        });

      });
      user_data.waypoints.push(req.params._oldid + '.' + req.params._id);
      user_data.save();
      return res.json(true);
    } else {
      return res.status(500);
    }
  });
}
  else{
    return res.status(500).json(false);
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
exports.location = function(req, res, next) {
  if(req.params._id){
    getLocation([req.params._id]).then( (data)=>{
      if(data == null || data.length == 0){
        return res.status(500);
      }
      else{
        return res.json(data);
      }
    })
  }
  else{
    return res.status(500);
  }
}

exports.post = function(req, res, next) {
  Race.findById(req.params._id, (err, race) => {
  if(err)
    {
      console.log(err);
      res.status(500);
      res.send();
    }
  else if(race != null) {
    if(race.waypoints.indexOf(req.body._id)<0){
      race.waypoints.push(req.body._id);

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
          race.save();
          return res.json(waypoint);
        }});
    }
  }
  });
  }
exports.fulldelete = function(req, res, next)
{
  Waypoint.findByIdAndDelete(req.params._id, function(err){
    if(err)
    {
      console.log(err);
      res.status(err.status || 500);
      res.render('error');
    }
    else{
      Race.find({waypoints: req.params._id}, (err, races) => {
        if(races != null) {
          races.forEach((race) => {
            if (race.waypoints.indexOf(req.params._id) > -1) {
              race.waypoints.splice(race.waypoints.indexOf(req.params._id), 1);
              race.save();
            }
          });
        }
      });
      User.find({waypoints: new RegExp('.*\.' + req.params._id + '$')}, (err, usersfind) => {
        usersfind.forEach((user) => {
          index = [];
          const matches = user.waypoints.filter(s => s.includes('.' + req.params._id));
          matches.forEach((match) => {
            i = user.waypoints.indexOf(match);
            user.waypoints.splice(i, 1);
          });
          user.save();
        });
        res.status(200);
        res.send();
      });
    }
  })
}
  exports.delete = function(req, res, next)
  {
      Waypoint.findById(req.params._id, function(err){
        if(err)
        {
            console.log(err);
          res.status(err.status || 500);
          res.render('error');
        }
        else{
          Race.findById(req.params._oldid, (err, race) => {
            if(race != null) {
                if (race.waypoints.indexOf(req.params._id) > -1) {
                  race.waypoints.splice(race.waypoints.indexOf(req.params._id), 1);
                  race.save();
                }
              User.find({waypoints: req.params._oldid+'.' + req.params._id}, (err, usersfind) => {
                usersfind.forEach((user) => {
                  index = [];
                  const matches = user.waypoints.filter(s => s.includes(req.params._oldid+'.' + req.params._id));
                  matches.forEach((match) => {
                    i = user.waypoints.indexOf(match);
                    user.waypoints.splice(i, 1);
                  });
                  user.save();
                });
                res.status(200);
                res.send(true);
              });
            }
            else{
              res.status(500);
              return res.send(false);

            }
          });
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
