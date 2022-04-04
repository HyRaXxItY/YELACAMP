const Campground = require('../models/campground');



module.exports.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
}

module.exports.createCampGet = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCamp = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('invalid data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground created successfully');
    res.redirect(`/campgrounds/${campground._id}`)

}


module.exports.showCampGet = async (req, res) => {
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
}

module.exports.editCampGet = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    // res.render('campgrounds/show', { camp })

    res.render('campgrounds/edit', { campground })
}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Campground updated successfully');
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully');
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds`);
}