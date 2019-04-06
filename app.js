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

const swaggerJSDoc = require('swagger-jsdoc');
var swaggerRouter = require('./routes/api-docs');
var racesRouter = require('./routes/racesRoute');
var waypointsRouter = require('./routes/waypointsRoute');


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

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ilovescotchscotchyscotchscotch', // session secret
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/races', racesRouter);
app.use('/races', waypointsRouter);
app.use('/', swaggerRouter);
require('./routes/userRoute.js')(app, passport);

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

module.exports = app;
