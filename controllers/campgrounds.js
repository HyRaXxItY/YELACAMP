const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });




module.exports.index = async(req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground, currentUser: req.user });
}

module.exports.createCampGet = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCamp = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const geometry = geoData.body.features[0].geometry;
    const campground = new Campground(req.body.campground);
    campground.geometry = geometry;
    campground.images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Campground created successfully');
    res.redirect(`/campgrounds/${campground._id}`)

}


module.exports.showCampGet = async(req, res) => {
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
    } else {
        res.render('campgrounds/show', { campground });
    }
}

module.exports.editCampGet = async(req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);


    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    // res.render('campgrounds/show', { camp })

    res.render('campgrounds/edit', { campground })
}

module.exports.editCamp = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    const img = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))
    campground.images.push(...img);
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(campground)
    }
    req.flash('success', 'Campground updated successfully');
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCamp = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully');
    // res.render('campgrounds/show', { camp })
    res.redirect(`/campgrounds`);
}