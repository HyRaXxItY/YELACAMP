const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.get('/register', users.registerGet);


router.post('/register', catchAsync(users.register));


router.get('/login', users.loginGet);


router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/auth/login'
}), users.login);


router.get('/logout', users.logout);


module.exports = router;
