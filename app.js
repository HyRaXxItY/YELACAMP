if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const MongoDBStore = require("connect-mongo"); //works differently now, see the docs for more info

const mongoSanitize = require('express-mongo-sanitize');



const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');
const usersRoute = require('./routes/users');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
//mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(" Database connected");

});



const app = express(); // app is only after we've integrated the database

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

// an app.use( code )
// everything that is there in ""code"" will be executed Everytime the web server runs // basically on every single request
// we can call it a middleware 

const secret = process.env.SESSION_SECRET || 'this is the secret';

// const store = new MongoDBStore({
//     url: "mongodb://localhost:27017/yelp-camp",
//     secret: 'ThisBetterBeAGoodShit',
//     touchAfter: 24 * 3600, //total seconds
// });

// store.on('error', function(error) {
//     console.log("session store error", error);
// });

const sessionConfig = {
    store: MongoDBStore.create({ mongoUrl: dbUrl, secret: secret, touchAfter: 24 * 3600 }),
    name: 'chrome-cookie',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //secure: true,
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 1,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}



app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds', campgroundsRoute);

app.use('/campgrounds/:id/reviews', reviewsRoute);

app.use('/auth', usersRoute);

app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404))
})
app.use((err, req, res, next) => {
    const { status_code = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(status_code).render('error/error', { err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {

    console.log(`serving on port ${port}`);
})