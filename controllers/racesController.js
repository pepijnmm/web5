var mongoose = require('mongoose');
var Race = require('../models/race');
var express = require('express');
var unirest = require('unirest');

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

      if(req.headers["Accept"] != undefined && req.headers["Accept"] == 'application/json') {
        return res.json(data);
      }
    else{
        return res.render('race/index', { data: data })
      }
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
//adres = straat nummer postcode plaats land(in engels)   meters 500 kan goed
exports.getlocations = function(adress, meters) {
  const urllatlong = "https://nominatim.openstreetmap.org/search/search.php?q=",
      urllatlongend = "&format=json",
      stcafes = "https://overpass-api.de/api/interpreter?data=[out:json];(",
      endcafes = ");out;";

  if(req.body.adress && req.body.adress != ""){
  unirest.get(urllatlong + req.body.adress + urllatlongend).header("User-Agent", "racedrinkgame").header("Accept", "application/json").end(function (result) {
    if (result.body[0] != "" || result.body != undefined) {
      const lat = parseFloat(result.body[0]["lat"]),
          long = parseFloat(result.body[0]["lon"]);
      unirest.get(stcafes + returncoords(lat, long, meters) + endcafes)
          .end(function (result) {
            if (req.body["elements"] != null && req.body["elements"].length > 0){
              return result.body;
            }
            else{
              return false;
            }
          });
    } else {
      return null;
    }
  });
}
};
    
 
function returncoords(lat,long, distance){
  return "node[amenity=pub](around:"+distance+","+lat+","+long+");" +
      "way[amenity=pub](around:"+distance+","+lat+","+long+");" +
      "relation[amenity=pub](around:"+distance+","+lat+","+long+");" +
      "node[amenity=cafe](around:"+distance+","+lat+","+long+");" +
      "way[amenity=cafe](around:"+distance+","+lat+","+long+");" +
      "relation[amenity=cafe](around:"+distance+","+lat+","+long+");" +
      "node[amenity=bar](around:"+distance+","+lat+","+long+");" +
      "way[amenity=bar](around:"+distance+","+lat+","+long+");" +
      "relation[amenity=bar](around:"+distance+","+lat+","+long+");";
}
