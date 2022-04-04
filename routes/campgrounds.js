const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


router.get('/', catchAsync(campgrounds.index));


router.get('/new', isLoggedIn, campgrounds.createCampGet);


router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp));


router.get('/:id', catchAsync(campgrounds.showCampGet));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampGet));


router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCamp));


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));


module.exports = router;