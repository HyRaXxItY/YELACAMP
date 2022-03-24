const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground.js');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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

// an app.use( code )
// everything that is there in ""code"" will be executed Everytime the web server runs // basically on every single request
// we can call it a middleware 


const validateCampground = function (err, req, res, next) {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',  ');
        throw new ExpressError(message, 404);
    } else {
        next();
    }
}
const validateReview = function (err, req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        const message = error.details.map(el => el.message).join(', \n ');
        throw new ExpressError(message, 404);
    } else {
        next();
    }
}



app.get('/', (req, res) => {
    res.render('campgrounds/home')
})

app.use('/campgrounds', campgrounds);

app.use('/campgrounds/:id/reviews', reviews);

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404))
})
app.use((err, req, res, next) => {
    const { status_code = 404, message = 'oh boy, we got some error there' } = err;

    res.status(status_code).render('error/error', { err });
})

app.listen(3000, () => {

    console.log("serving on port 3000");
})