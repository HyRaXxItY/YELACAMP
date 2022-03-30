module.exports.isLoggedIn = function (req, res, next) {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/auth/login');
    }
    return next();
}
