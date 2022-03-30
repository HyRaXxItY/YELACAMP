const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});


router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, password, email });
        const dis = await User.register(newUser, password);
        console.log(dis);
        req.login(dis, (err) => {
            if (err) return next(err);
            console.log("yeah you are - ", req.user.username);
            req.flash('success', 'You have been registered and logged in!');
            return res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('/register');

    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/auth/login'
}), (req, res) => {
    req.flash('success', 'welcome to advGuild');
    res.redirect('/campgrounds');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'logged out');
    res.redirect('/campgrounds');
});


module.exports = router;
