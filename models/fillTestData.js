var mongoose = require('mongoose');
Race = mongoose.model('Race');
Waypoint = mongoose.model('Waypoint');
User = mongoose.model('User');

let waypoint_seed = [
    {
        name: "Kroeg 1",
    },
    {
        name: "Kroeg 2",
    }
];

let race_seed = [
    {
        _id: "Race 1",
    },
    {
        _id: "Race 2",
    }
];

let user_seed = [
    {
        local: {
        email: "test123",
        password: "test123"
        }
    }
];

module.exports = new Promise((resolve, reject) => {
    Promise.all([
        Race.insertMany(race_seed),
        Waypoint.insertMany(waypoint_seed),
        User.insertMany(user_seed),
    ])
    .then(() => resolve())
    .catch(err => {
        console.log('failed to insert testdata', err);
        reject(err);
    });
});