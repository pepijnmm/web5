var mongoose = require('mongoose');

let raceSchema = mongoose.Schema({
    _id: {
        type: String,
    },
    isStarted: {
        type: Boolean,
        default: false,
    },
    waypoints: [{type: String, ref: 'Waypoint'}]
});

let Race = module.exports = mongoose.model('Race', raceSchema);