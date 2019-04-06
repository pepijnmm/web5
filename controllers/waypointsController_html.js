var mongoose = require('mongoose');
var Race = require('../models/race');
var Waypoint = require('../models/waypoint');
exports.getCreate = function(req, res, next) {
    return res.render('waypoint/create', {race_id: req.params._oldid})
}
