let router = require('express').Router();

router.get('/asking', (req, res) => {
    res.render('askingQuestion')
});

router.get('/:questionID/answer', (req, res) => {
    res.render('answerQuestion', {questionID: req.params.questionID})
});

router.get('/session', (req, res) => {
    res.render('addSession')
});

router.get('/userManagement', (req, res) => {
    res.render('userManagement')
});

module.exports = router;