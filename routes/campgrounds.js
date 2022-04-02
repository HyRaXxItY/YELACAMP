const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('invalid data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground created successfully');
    res.redirect(`/campgrounds/${campground._id}`)

}));


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author' // for populating the author of the path ('reviews')
                // reviews and different author as cmp to campground author
            }

        }).populate('author');
    console.log(campground);
    // res.render('campgrounds/show', { camp })
    if (!campground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    else {
        res.render('campgrounds/show', { campground });
    }
}));







router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    // res.render('campgrounds/show', { camp })

    res.render('campgrounds/edit', { campground })
}));


router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Campground updated successfully');
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds/${campground._id}`)
}));


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully');
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds`);
}));




module.exports = router;