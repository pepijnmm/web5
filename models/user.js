
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    waypoints: [{type: String}],
});

userSchema.path('local.email').validate(function (email) {
    if(email)
    {
        var emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        return emailRegex.test(email);
    }
   return true;

 }, 'Email is not in the right format')

//  userSchema.path('local.password').validate(function (password) {
//     console.log("password validatie");
//     console.log(password);
//     console.log("local pass::")
//     console.log(this.password);

//     if(password && password !== this.password)
//     {
//         var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//         return true;//passwordRegex.test(password);
//     }
//     else{
//         return true;
//     }
   
//  }, 'Password must be 8 characters, atleast 1 number and 1 letter ')

 userSchema.pre('save', async function (next) {
     var user = this;

     if (!this.isNew) {
         return next();
     } else {
         console.log(user.local.password);
         console.log(user.local);
         console.log(user)

         if (user.local.password) {
             console.log("wat");
             var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
             if (!passwordRegex.test(user.local.password)) {

                 throw new Error('Password must be length of 8 and contain 1 letter and 1 number');
                 return;
             }

             var salt = bcrypt.genSaltSync(saltRounds);
             user.local.password = bcrypt.hashSync(user.local.password, salt);
         }

         next();
     }
 });



userSchema.methods.validPassword = function (password, hash) {
    return bcrypt.compareSync(password, hash);
};

userSchema.methods.hashPassword = function (password) {
    var salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

let User = mongoose.model('User', userSchema);


module.exports = User;
