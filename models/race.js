var mongoose = require('mongoose');
var assert = require('assert');

let raceSchema = mongoose.Schema({
    _id: {
        type: String,
    },
    isStarted: {
        type: Boolean,
        default: false,
        required: true,
    },
    waypoints: [{type: Number, ref: 'Waypoint'}]
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

raceSchema.query.byPage = function (pageIndex, pageSize) {
    pageIndex = pageIndex || 0;
    pageSize = parseInt(pageSize) || 10;
    return this.find().skip(pageIndex * pageSize).limit(pageSize);
};

raceSchema.query.byStarted = function (started) {
    if (started) {
        return this.find({ isStarted: started });
    } else {
        return this.find();
    }
};

raceSchema.virtual('numberOfWaypoints').get(function () {
    return this.waypoints.length;
});

let Race = mongoose.model('Race', raceSchema);

module.exports = Race;
