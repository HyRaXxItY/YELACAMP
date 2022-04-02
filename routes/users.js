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
        const { email, username, password } = req.body;
        const newUser = new User({ email, username, password });
        const dis = await User.register(newUser, password);
        req.login(dis, err => {
            if (err) return next(err);
            req.flash('success', 'You have been registered and logged in!');
            return res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('auth/register');

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
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'logged out');
    res.redirect('/campgrounds');
});


module.exports = router;
