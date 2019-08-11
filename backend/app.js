var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var patientRouter = require('./routes/patient');

var heightRouter = require('./routes/records/height');
var weightRouter = require('./routes/records/weight');

var app = express();

mongoose.connect(
        'mongodb+srv://premit:' +
        process.env.MONGO_ATLAS_PW +
        '@cluster0-kxvjt.mongodb.net/premit?retryWrites=true&w=majority', { useNewUrlParser: true }
    )
    .then(() => {
        console.log('connected to database');
    })
    .catch(() => {
        console.log('connection failed');
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use('/', express.static(path.join(__dirname, 'angular')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/patients', patientRouter);

app.use('/api/heights', heightRouter);
app.use('/api/weights', weightRouter);
//app.use((req, res, next) => {
//    res.sendFile(path.join(__dirname, 'angular', 'index.html'));
//});

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
