
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
    local: {
        email: {
            type: String,
            maxLength: 255,
        },
        password: {
            type: String,
            minLength: 5,
            maxLength: 255
        }
    },
    google: {
        id: {
            type: String,
            maxLength: 255
        } ,
        token: {
            type: String,
            maxLength: 255
        } ,
        email: {
            type: String,
            maxLength: 255
        } ,
        name: {
            type: String,
            maxLength: 255
        } ,
    },
    facebook: {
        id: {
            type: String,
            maxLength: 255
        } ,
        token: {
            type: String,
            maxLength: 255
        } ,
        email: {
            type: String,
            maxLength: 255
        } ,
        name: {
            type: String,
            maxLength: 255
        } 
    },
    isAdmin: {
        default: false,
        type: Boolean,
        required: true
    },
    races: [{type: String, ref: 'Race'}],
    waypoints: [{type: String, ref: 'Waypoint'}],
});

userSchema.path('local.email').validate(function (email) {
    var emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    console.log(email);
    console.log('validatie');
    return emailRegex.test(email);
 }, 'Email is not in the right format')

 userSchema.path('local.password').validate(function (password) {
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
 }, 'Password must be 8 characters, atleast 1 number and 1 letter ')

 userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('local.password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.local.password, salt, null, function(err, hash) {
            if (err) return next(err);

            user.local.password = hash;
            next();
        });
    });
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password); 
};

let User = mongoose.model('User', userSchema);


module.exports = User;
