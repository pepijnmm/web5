var mongoose = require('mongoose');
var Race = require('../models/race');
var express = require('express');
var unirest = require('unirest');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

exports.getAmountofUsers = function(race) {
  return new Promise(async (resolve, reject) => {
    users = [];
    await Race.findById(race,async (err, data) => {
      if(race) {
        await asyncForEach(data.waypoints, async (waypoint) => {
          await User.find({waypoints: race + '.' + waypoint}, async (err, usersfind) => {
            await asyncForEach(usersfind, async (user) => {
              if (!users.includes(String(user._id))) users.push(String(user._id));
            });
            if (waypoint == data.waypoints[data.waypoints.length - 1]) {
              resolve(users.length);
            }
          });
        });
      }
    });
  });
}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

exports.get = function(req, res, next) {
    var query = {};

    if (req.params._id) {
      query._id = req.params._id;
    }

    var result = Race.find(query)
        .byPage(req.query.pageIndex, req.query.pageSize);

    result.then(data => {
      if (req.params._id) {
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
          console.log('verwijderd');
          User.find({waypoints: new RegExp('^'+req.params._id+'\..*')}, (err, usersfind) => {
            console.log('een gevonden?',usersfind);
            usersfind.forEach((user) => {
              console.log(user);
              index = [];
              const matches = user.waypoints.filter(s => s.includes(req.params._id+'.'));
              matches.forEach((match)=>{
                i = user.waypoints.indexOf(match);
                user.waypoints.splice(i,1);
              });
              user.save();
            });
            res.status(200);
            res.send();
          });

        }
      })
  }
  exports.edit = function(req, res, next)
  {
    Race.findById(req.params._id, (err, race) =>
    {
      if(err)
      {
        console.log(err);
        res.status(500);
        res.send();
      }
      else if(race != null)
      {

        var newrace = new Race({_id:req.body._id, isStarted: race.isStarted, waypoints:race.waypoints});
        newrace.save(function(err)
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
            Race.findByIdAndDelete(req.params._id, function(err) {
              if (err) {
                res.status(err.status || 500);
                res.render('error');
              } else {
                User.find({waypoints: new RegExp('^'+req.params._id+'\..*')}, (err, usersfind) => {
                  usersfind.forEach((user) => {
                    console.log(user);
                    index = [];
                      const matches = user.waypoints.filter(s => s.includes(req.params._id+'.'));
                      matches.forEach((match)=>{
                        i = user.waypoints.indexOf(match);
                        waypoint = newrace._id + '.' + user.waypoints[i].split('.')[1];
                        user.waypoints.splice(i,1);
                        user.waypoints.push(waypoint);
                      });
                    user.save();
                  });
                  return res.json(race);
                });
              }
            });
          }});
      }
      else{
        res.status(500);
        res.render('error');
      }
    });
  }
  exports.enable = function(req, res, next)
  {
    Race.findByIdAndUpdate(req.params._id, {isStarted: true}, {new: true}, (err, race) =>
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
//id = id van een plaats
exports.getlocation = function(req, res, next) {
  const stcafes = "https://overpass-api.de/api/interpreter?data=[out:json];";
  if (!(req.body.id && req.body.id != "")) {
    return;
  }
  query = "";
  req.body.id.each((data) => {
    query+="node(id:"+data+");out;";
  })
  unirest.get(stcafes + query)
      .end(function (result) {
        if (result.body.elements != null && result.body.elements.length > 0) {
          return res.json(result.body.elements[0]);
        } else {
          return res.json(null);
        }
      });
};
//adres = straat nummer postcode plaats land(in engels)   meters 500 kan goed
exports.getlocations = function(req, res, next) {
  const urllatlong = "https://nominatim.openstreetmap.org/search/search.php?q=",
      urllatlongend = "&format=json",
      stcafes = "https://overpass-api.de/api/interpreter?data=[out:json];",
      endcafes = "";
  if(req.body.adress && req.body.adress != "" && req.body.meters != ""){
  unirest.get(urllatlong + req.body.adress + urllatlongend).header("User-Agent", "racedrinkgame").header("Accept", "application/json").end(function (result) {
    if (result.body[0] != "" || result.body != undefined) {
      const lat = parseFloat(result.body[0]["lat"]),
          long = parseFloat(result.body[0]["lon"]);
      unirest.get(stcafes + returncoords(lat, long, req.body.meters) + endcafes)
          .end(function (result) {
            if (result.body.elements != null && result.body.elements.length > 0){
              return res.json(result.body.elements);
            }
            else{
              return res.json(null);
            }
          });
    } else {
      return res.json(null);
    }
  });
}
};
    
 
function returncoords(lat,long, distance){
  return "node[amenity=pub](around:"+distance+","+lat+","+long+");out;" +
      "way[amenity=pub](around:"+distance+","+lat+","+long+");out;" +
      "relation[amenity=pub](around:"+distance+","+lat+","+long+");out;" +
      "node[amenity=cafe](around:"+distance+","+lat+","+long+");out;" +
      "way[amenity=cafe](around:"+distance+","+lat+","+long+");out;" +
      "relation[amenity=cafe](around:"+distance+","+lat+","+long+");out;" +
      "node[amenity=bar](around:"+distance+","+lat+","+long+");out;" +
      "way[amenity=bar](around:"+distance+","+lat+","+long+");out;" +
      "relation[amenity=bar](around:"+distance+","+lat+","+long+");out;";
}
