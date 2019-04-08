var mongoose = require('mongoose');

let waypointSchema = mongoose.Schema({
    _id: {
        type: Number,
    }
});

let Waypoint = mongoose.model('Waypoint', waypointSchema);

module.exports = Waypoint;
