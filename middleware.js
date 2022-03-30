module.exports.isLoggedIn = function (req, res, next) {
    console.log(req.user);
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/auth/login');
}
