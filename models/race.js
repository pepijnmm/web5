var mongoose = require('mongoose');
var assert = require('assert');

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

raceSchema.query.byPage = function (pageIndex, pageSize) {
    pageIndex = pageIndex || 0;
    pageSize = parseInt(pageSize) || 10;
    return this.find().skip(pageIndex * pageSize).limit(pageSize);
};

let Race = mongoose.model('Race', raceSchema);

module.exports = Race;
