let userType = require("../models/userType");

module.exports = {
    isNotLoggedIn(req, res, next) {
        if (!req.session.userInfo) {
            return next();
        }
        res.redirect('/session');
    },
    isLoggedIn(req, res, next) {
        if (req.session.userInfo) {
            return next();
        }
        res.redirect('/');
    },
    isLecturerOrAdmin(req, res, next) {
        if (req.session.userInfo && (req.session.userInfo.role === userType.lecturer ||
            req.session.userInfo.role === userType.admin)) {
            return next();
        }
        res.redirect('/');
    },
    isStudent(req, res, next) {
        if (req.session.userInfo && req.session.userInfo.role === userType.student) {
            return next();
        }
        res.redirect('/');
    },
    isAdmin(req, res, next) {
        if (req.session.userInfo && req.session.userInfo.role === userType.admin) {
            return next();
        }
        res.redirect('/');
    }
};