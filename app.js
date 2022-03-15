const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground.js');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')


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

// an app.use( code )
// everything that is there in ""code"" will be executed Everytime the web server runs // basically on every single request
// we can call it a middleware 

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})


app.get('/campgrounds', async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync(async (req, res) => {
    if (!req.body.campground) throw new ExpressError('invalid data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}))


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // res.render('campgrounds/show', { camp })
    res.render('campgrounds/show', { campground })
}))




app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // res.render('campgrounds/show', { camp })
    res.render('campgrounds/edit', { campground })
}))


app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds`);
}))

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