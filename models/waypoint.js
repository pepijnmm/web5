var mongoose = require('mongoose');

let waypointSchema = mongoose.Schema({
    _id: {
        type: Number,
    },
    order: {
        type: Number,
    }
});


waypointSchema.query.byPage = function (pageIndex, pageSize) {
    pageIndex = pageIndex || 0;
    pageSize = parseInt(pageSize) || 10;
    return this.find().skip(pageIndex * pageSize).limit(pageSize);
};

waypointSchema.query.byAdress = function (adr) {
    if (fullName) {
        return this.find({ adress: adr });
    } else {
        return this.find();
    }
};


let Waypoint = mongoose.model('Waypoint', waypointSchema);

module.exports = Waypoint;
