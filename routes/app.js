let helper = require("../helpers/question");
let router = require('express').Router();

router.get('/asking', (req, res) => {
    res.render('askingQuestion')
});

router.get('/:questionID/answer', async (req, res) => {
    const question = await helper.getQuestionByID(req.params.questionID);
    res.render('answerQuestion', {question})
});

router.get('/session', (req, res) => {
    res.render('addSession')
});

router.get('/userManagement', (req, res) => {
    res.render('userManagement')
});

module.exports = router;