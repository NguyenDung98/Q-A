let router = require('express').Router(),
    helpers = require('../helpers/session'),
    middleware = require('../middleware');

const apiRoute = '/api/session';

router.route(`${apiRoute}/`)
    .get(helpers.getAllSession)
    .post(helpers.createSession);

router.route(`${apiRoute}/:sessionID`)
    .put(helpers.updateSession)
    .delete(helpers.deleteSession);

router.route(`${apiRoute}/:userID`)
    .get(helpers.getSessionsByUserID);

// truy cập vào trang session tương ứng với loại người dùng
router.get('/session', middleware.isLoggedIn, (req, res) => {
    res.render('session', {userInfo: req.session.userInfo})
});

router.get('/lecturer/session', middleware.isLecturer, (req, res) => {
    res.render('lecturerSession', {userInfo: req.session.userInfo})
});

router.get('/admin/session', middleware.isAdmin, (req, res) => {
    res.render('sessionManagement');
});

module.exports = router;