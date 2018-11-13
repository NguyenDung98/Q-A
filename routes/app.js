let questionHelper = require("../helpers/question"),
    sessionHelper  = require('../helpers/session'),
    router         = require('express').Router();

router.get('/session/:eventCode', async (req, res) => {
    try {
        const session = await sessionHelper.getSessionByID(req.query.id);
        if (!session || session.eventCode !== req.params.eventCode) throw new Error('session not found');
        res.render('askingQuestion', {session})
    } catch (error) {
        console.log(error);
        res.redirect('/session')
    }
});

router.get('/session/:eventCode/question/:order', async (req, res) => {
    try {
        const session = await sessionHelper.getSessionByID(req.query.id);
        const question = await questionHelper.getQuestionByID(req.query.question);
        if (!session) throw new Error('session not found');
        if (!question) throw new Error('question not found');
        if (question.session.toString() !== session._id.toString()) throw Error("This question is not in this session!");
        res.render('answerQuestion', {question, eventName: session.eventName})
    } catch (error) {
        console.log(error);
        res.redirect('/session')
    }
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