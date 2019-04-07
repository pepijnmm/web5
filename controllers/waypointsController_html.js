var mongoose = require('mongoose');
var Race = require('../models/race');
var Waypoint = require('../models/waypoint');
exports.getCreate = function(req, res, next) {
    return res.render('waypoint/create', {race_id: req.params._oldid})
}
exports.getRace = function(req, res, next) {
    var query = {};

    if(req.params._oldid) {
        query._id = req.params._oldid;
        var result = Race.find(query);
        result.then(data => {
                arr = [];
                data[0].waypoints.forEach(element => {
                    arr.push(element)
                });
                var result = Waypoint.where('_id').in(arr)
                    .byPage(req.query.pageIndex, req.query.pageSize);

                result.then(data => {
                    if (req.params._id) {
                        data = data[0];
                    }

                    return res.render('waypoint/index', {data: data, _oldid: req.params._oldid});
                }).catch(err => {
                    console.log(err);
                    res.status(err.status || 500);
                    res.render('error');
                });
        });
    }
    else{
        res.render('error')
    }
}
