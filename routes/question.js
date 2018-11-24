let router = require('express').Router(),
    questionHelper = require('../helpers/question'),
    sessionHelper = require("../helpers/session");
const middleware = require("../middleware");

const apiRoute = '/api/question';

router.route(`${apiRoute}/`)
    .get(questionHelper.getAllQuestion)
    .post(questionHelper.createQuestion);

router.route(`${apiRoute}/:questionID`)
    .put(questionHelper.updateQuestion);

router.route(`${apiRoute}/:sessionID`)
    .get(questionHelper.getQuestionBySessionId);

// lấy tất cả các câu hỏi trong 1 phiên hỏi đáp
// cho sinh viên
router.get('/session/:eventCode', middleware.isLoggedIn ,async (req, res) => {
    try {
        const session = await sessionHelper.getSessionByID(req.query.id);
        if (!session || session.eventCode !== req.params.eventCode) throw new Error('session not found');
        res.render('askingQuestion', {session, userInfo: req.session.userInfo, lastHref: req.headers.referer})
    } catch (error) {
        console.log(error);
        res.redirect('/session')
    }
});

router.get('/lecturer/session/:eventCode', middleware.isLecturerOrAdmin ,async (req, res) => {
    try {
        const session = await sessionHelper.getSessionByID(req.query.id);
        if (!session || session.eventCode !== req.params.eventCode) throw new Error('session not found');
        res.render('lecturerQuestion', {session, userInfo: req.session.userInfo, lastHref: req.headers.referer})
    } catch (error) {
        console.log(error);
        res.redirect('/session')
    }
});

module.exports = router;