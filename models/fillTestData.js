var mongoose = require('mongoose');
Race = mongoose.model('Race');
Waypoint = mongoose.model('Waypoint');
User = mongoose.model('User');

let waypoint_seed = [
    {
        _id: "Kroeg 1",
        name: "van willemse",
        adress: "straat 1",
    },
    {
        _id: "Kroeg 2",
        name: "van pietsr biertap",
        adress: "straat 4",
    },
    {
        _id: "Kroeg 3",
        name: "peters pilsje",
        adress: "straat 5",
    },
    {
        _id: "Kroeg 4",
        name: "hugos ontbijtje",
        adress: "straat 6",
    }
];

let race_seed = [
    {
        _id: "Race 1",
        waypoints: [
            "Kroeg 1"
        ],
    },
    {
        _id: "Race 2",
        waypoints: [
            "Kroeg 2",
            "Kroeg 3",
            "Kroeg 4"
        ]
    }
];

let user_seed = [
    {
        local: {
        email: "test123",
        password: "test123"
        }
    },
    {
        local: {
            email: "admin",
            password: "admin"
        },
        isAdmin: true
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
