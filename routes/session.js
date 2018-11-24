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

router.get('/lecturer/session', middleware.isLecturerOrAdmin, (req, res) => {
    res.render('lecturerSession', {userInfo: req.session.userInfo})
});

router.get('/admin/session', middleware.isAdmin, (req, res) => {
    res.render('sessionManagement');
});

// cập nhật lại phiên khi cập nhật khảo sát
router.put('/session/:sessionID', middleware.isLoggedIn, async (req, res) => {
    let session = await helpers.getSessionByID(req.params.sessionID);
    session.survey.data.push({...req.body, user: req.session.userInfo._id});
    helpers.updateSession_server(req.params.sessionID, session);
    res.redirect(`${req.headers.referer}?id=${req.params.sessionID}`);
});

module.exports = router;