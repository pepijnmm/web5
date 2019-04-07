var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var exphbs  = require('express-handlebars');
var cookie = require('cookie');

var racesController = require('./controllers/racesController');

const swaggerJSDoc = require('swagger-jsdoc');
var swaggerRouter = require('./routes/api-docs');
var racesRouter = require('./routes/racesRoute');
var userRouter = require('./routes/userRoute.js');
var waypointsRouter = require('./routes/waypointsRoute');

var app = express();


var server = require('http').Server(app);
var io = require('socket.io')(server);


mongoose.connect('mongodb://localhost:27017/RestRace', { useNewUrlParser: true});
 let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//models
require('./models/race');
require('./models/waypoint');
require('./models/user');

let Race = mongoose.model('Race');
Race.find({}).then(race => {
    if(!race.length){
        console.log('\tNo races found, filling testdata');
        require('./models/fillTestData')
            .then(() => console.log('\tFilling testdata succesfull'))
            .catch(err => console.log('\tFilling testdata failed', err));
    }
});
mongoose.set('useFindAndModify', false);

require('./config/passport')(passport);


// var hbs = exphbs.create({
//     extname: '.hbs',
//     //layoutsDir: path.join(__dirname, '/views'),
//     //defaultLayout: 'layout'
// });
//


// view engine setup
//app.engine('hbs', exphbs({layoutsDir: path.join(__dirname, '/views'),extname: '.hbs',defaultLayout: 'layout'}));
//app.set('view engine', 'hbs');
var hbs = exphbs.create({
    layoutsDir: path.join(__dirname, '/views'),
    defaultLayout: 'layout',
    extname: '.hbs',
    // Specify helpers which are only registered on this instance.
    helpers: {
        ifcond: function (v1, operator, v2, options) {

            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//app.set('views', path.join(__dirname, '/views'));
//app.engine('handlebars', exphbs());
//app.set('view engine', 'handlebars');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: 'ilovescotchscotchyscotchscotch', // session secret
  resave: true,
  saveUninitialized: true
}));

io.sockets
    .on('connection', function(socket){
    var cookies = cookie.parse(socket.handshake.headers.cookie);
    checktoken(cookies.token).then((fullfill)=>{
        if(app.locals.isAdmin){
            socket.join('admin');
        }
        else {
            socket.join('user');
        }
        socket.on('amount users', function(id){
            racesController.getAmountofUsers(id).then((amount)=>{
                socket.emit('amountUser', amount);
            });
        });
    }, (reject)=>{
        socket.join('notlogedin');
    });
});


app.use(passport.initialize());
app.use(passport.session());

app.use('/', swaggerRouter);
function isVerified(req, res, next) {
    var bearerToken = req.cookies['token'];
    if(bearerToken == null){
        if(req.headers['authorization'] != undefined && req.headers['authorization'] != null) {
            bearerToken = req.headers['authorization'];
            bearerToken = bearerToken.replace('Bearer ','');
        }
    }
    checktoken(bearerToken).then((fullfill)=>{
        req.verifiedUser = fullfill;
        next();
    }, (reject)=>{
        res.redirect('/login');
        return false;
    });
}
async function checktoken(token) {
        return new Promise((resolve, reject) => {
            if (typeof token !== 'undefined') {
                token = jwt.verify(token, 'geheim', (err, data) => {
                    if(err){
                        reject();}
                    else{
                        app.locals.isAdmin = data.user.isAdmin;
                        resolve(data);
                    }});
            } else {
                reject();
            }
        });
}
app.use(function(req, res, next){
    res.io = io;
    next();
});
app.use('/', userRouter);
app.use('/', isVerified);
app.use('/races', racesRouter);
app.use('/races', waypointsRouter);
app.use('/*',(req, res,next)=>{
    res.redirect('/races');
});

app.get('*', function(req, res){
    res.render('error',{message:"pagina niet gevonden", error:{status:404}});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
