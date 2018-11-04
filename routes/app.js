let questionHelper = require("../helpers/question"),
    sessionHelper  = require('../helpers/session'),
    router         = require('express').Router();

router.get('/session/:sessionID', async (req, res) => {
    const session = await sessionHelper.getSessionByID(req.params.sessionID);
    res.render('askingQuestion', {session})
});

router.get('/session/:sessionID/question/:questionID', async (req, res) => {
    const question = await questionHelper.getQuestionByID(req.params.questionID);
    const session = await sessionHelper.getSessionByID(req.params.sessionID);
    res.render('answerQuestion', {question, eventName: session.eventName})
});

router.get('/session', (req, res) => {
    res.render('addSession')
});

router.get('/admin/user', (req, res) => {
    res.render('userManagement')
});

router.get('/admin/session', (req, res) => {
    res.render('sessionManagement')
});



module.exports = router;