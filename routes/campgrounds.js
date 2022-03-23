const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Review = require('../models/review');


const validateCampground = function (err, req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',  ');
        throw new ExpressError(message, 404);
    } else {
        next();
    }
}


router.get('/', async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('invalid data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}))


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    // res.render('campgrounds/show', { camp })
    res.render('campgrounds/show', { campground })
}))




router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // res.render('campgrounds/show', { camp })
    res.render('campgrounds/edit', { campground })
}))


router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds`);
}));




module.exports = router;