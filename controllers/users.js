const User = require('../models/user');
const passport = require('passport');
const user = require('../models/user');


module.exports.register = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const dis = await User.register(newUser, password);
        req.login(dis, err => {
            if (err) return next(err);
            req.flash('success', 'You have been registered and logged in!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('register');

    }
}

module.exports.registerGet = (req, res) => {
    res.render('users/register');
}

module.exports.loginGet = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome to advGuild');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'logged out');
    res.redirect('/campgrounds');
}