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
exports.getlocations = function(req, res, next) {
  const urllatlong="https://nominatim.openstreetmap.org/search/search.php?q=",
      urllatlongend="&format=json"
  stcafes = "https://overpass-api.de/api/interpreter?data=[out:json];(node(",
      endcafes = ")[amenity=bar];);out%20center;%3E;out;";
  const meters = 10,
      adress = "lange+Tuinstraat+3+5212SG+Den+Bosch+The+Netherlands";
  unirest.get(urllatlong+adress+urllatlongend).end(function (result) {
    console.log(result);
    const lat = result[0]["lat"],
        long = result[0]["long"];
    var latRadian = 3958.7558657440545;

    var degLatKm = 110.574235;
    var degLongKm = 110.572833 * Math.cos(latRadian);
    var deltaLat = meters / 1000.0 / degLatKm;
    var deltaLong = meters / 1000.0 / degLongKm;


    var topLat = lat + deltaLat;
    var bottomLat = lat - deltaLat;
    var leftLng = long - deltaLong;
    var rightLng = long + deltaLong;

    var northEastCoords = topLat + ',' + rightLng;
    var southWestCoords = bottomLat + ',' + leftLng;
    unirest.get(stcafes+northEastCoords+","+southWestCoords+endcafes)
        .header("Accept", "application/json")
        .end(function (result) {
          res.send(result);
        });
  });
}
    
 
