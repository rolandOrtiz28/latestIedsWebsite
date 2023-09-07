const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'Restricted Area');
        return res.redirect('/')
    }
    next();
}