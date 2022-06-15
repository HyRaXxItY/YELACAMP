const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const User = require('../models/user');


router.route('/register')
    .get(users.registerGet)
    .post(catchAsync(users.register));


router.route('/login')
    .get(users.loginGet)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), users.login);


router.get('/logout', users.logout);


module.exports = router;