
var mongoose = require('mongoose');

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
    }
});

userSchema.methods.validPassword = function(password) {
    return password === this.local.password; //bcrypt.compareSync(password, this.local.password);
};

let User = mongoose.model('User', userSchema);


module.exports = User;