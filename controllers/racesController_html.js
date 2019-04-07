var mongoose = require('mongoose');
var Race = require('../models/race');
var unirest = require('unirest');
var User = require('../models/user');
exports.get = function(req, res, next) {
    var query = {};
    if (req.params._id) {
        query._id = req.params._id;
    }

    var result = Race.find(query);
    result.then(data => {
        if (req.params._id) {
            data = data[0];
        }
        return res.render('race/index', { data: data })
    }).catch(err => {
        console.log(err);
        res.status(err.status || 500);
        res.render('error');
    });

}
exports.edit = function(req, res, next) {
    if (req.params._id) {
        Race.findById(req.params._id, (err, race) => {
            if(race != null) {
                return res.render('race/edit', {data: req.params._id})
            }
            else{
                res.status(500);
                res.render('error');
            }
        });
    }

}
exports.getCreate = function(req, res, next) {
    return res.render('race/create')
}
exports.show = function(req, res, next) {
    if(req.params._id != undefined) {
        todo = [];
        Race.findById(req.params._id).then(data => {
            if(data != null && ( data.isStarted || req.verifiedUser.user.isAdmin)) {
                data.waypoints.forEach(waypoint => {
                    todo.push(waypoint);
                });
                getLocation(todo).then((waypoints) => {
                    var user = req.verifiedUser.user;
                    User.findById(user._id).then(user_data => {
                        if(user_data != null) {
                            waypoints.forEach((point) => {
                                if (user_data.waypoints.includes(req.params._id + '.' + point.id)) {
                                    point.done = true;
                                }
                            });
                            nieuwdata = {old: data, waypoints: waypoints};
                            return res.render('race/show', {data: nieuwdata})
                        }
                        else{
                            res.redirect('/logout');
                        }
                    });
                });
            }
            else{
                res.status(500);
                res.render('error');
            }
        }).catch(err => {
            console.log(err);
            res.status(err.status || 500);
            res.render('error');
        });
    }
    else{
        res.redirect('/races/');
    }
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
