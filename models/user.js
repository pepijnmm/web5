
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    isAdmin: {
        default: false,
        type: Boolean,
        required: true
    },
    waypoints: [{type: String}],
});

// userSchema.path('email').validate(function (email) {
//     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//     return emailRegex.test(email.text);
//  }, 'Email cant be empty')

userSchema.methods.validPassword = function(password) {
    return password === this.local.password;
};

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword2 = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

let User = mongoose.model('User', userSchema);


module.exports = User;
