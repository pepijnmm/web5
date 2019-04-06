var mongoose = require('mongoose');
var Race = require('../models/race');
var express = require('express');
var unirest = require('unirest');
var jwt = require('jsonwebtoken');

// exports.get = function(req, res, next) {
//   jwt.verify(req.token, 'geheim', (err, data) => {
//     if(err)
//     {
//       res.sendStatus(403);
//     }else{
//
//     }
//   })
//
//   var query = {};
//
// 	if(req.params._id){
// 		query._id = req.params._id;
//   }
//
//   var result = Race.find(query)
//   .byPage(req.query.pageIndex, req.query.pageSize);
// }




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
  exports.accept = function(req, res, next)
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
  const stcafes = "https://overpass-api.de/api/interpreter?data=[out:json];",
      endcafes = "out;";
  if (!(req.body.id && req.body.id != "")) {
    return;
  }
  query = "";
  req.body.each((data) => {
    query+="node(id:"+data+");";
  })
  unirest.get(stcafes + query + endcafes)
      .end(function (result) {
        if (result.body.elements != null && result.body.elements.length > 0) {
          console.log(result.body.elements);
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
