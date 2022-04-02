const express = require('express');
// const { route } = require('./campgrounds');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Review = require('../models/review');
const campgrounds = require('../routes/campgrounds');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');






router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created successfully');
    res.redirect(`/campgrounds/${campground._id}`)


}));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // pull--> literally pulls the value from the array ( here it pulls reviews array element having 
    // element id as reviewId )
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);

}))


module.exports = router 