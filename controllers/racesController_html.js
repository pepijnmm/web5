var mongoose = require('mongoose');
var Race = require('../models/race');
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
exports.getCreate = function(req, res, next) {
    return res.render('race/create')
}
exports.show = function(req, res, next) {
    if(req.params._id != undefined) {
        var query = {};
        if (req.params._id) {
            query._id = req.params._id;
        }

        var result = Race.find(query);

        result.then(data => {
            if (req.params._id) {
                data = data[0];
            }
            return res.render('race/show', {data: data})
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
