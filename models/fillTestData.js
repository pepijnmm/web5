var mongoose = require('mongoose');
Race = mongoose.model('Race');
Waypoint = mongoose.model('Waypoint');
User = mongoose.model('User');

let waypoint_seed = [
    {
        _id: 471587832,
        order: 1,
    },
    {
        _id: 471587844,
        order: 1,
    },
    {
        _id: 471587846,
        order: 2,
    },
    {
        _id: 471587848,
        order: 3,
    }
];

let race_seed = [
    {
        _id: "Race den bosch",
        waypoints: [
            471587832
        ],
    },
    {
        _id: "Arnhem bierdag",
        waypoints: [
            471587844,
            471587846,
            471587848
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
