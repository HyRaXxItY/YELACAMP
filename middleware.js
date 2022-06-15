const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');


module.exports.validateReview = function(err, req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        const message = error.details.map(el => el.message).join(', \n ');
        throw new ExpressError(message, 404);
    } else {
        next();
    }
}


module.exports.isLoggedIn = function(req, res, next) {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/login');
    }
    return next();
}


module.exports.validateCampground = (err, req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',  ');
        throw new ExpressError(message, 404);
    } else {
        next();
    }
}


module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this review');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}