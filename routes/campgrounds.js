const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp));

router.get('/new', isLoggedIn, campgrounds.createCampGet);
// must be above :id or otherwise it will be caught by the (:id) route as they have same 
// numbers of params and express get confused

router.route('/:id')
    .get(catchAsync(campgrounds.showCampGet))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));




router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampGet));


module.exports = router;