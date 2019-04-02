var mongoose = require('mongoose');

let waypointSchema = mongoose.Schema({
    _id: {
        type: String,
    },
});

let Waypoint = module.exports = mongoose.model('Waypoint', waypointSchema);