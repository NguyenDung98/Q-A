let router = require('express').Router();
const prevDir = __dirname.substr(0, __dirname.lastIndexOf('\\'));

router.get('/asking', (req, res) => {
    res.sendFile(prevDir + "/views/askingQuestion.html");
});

router.get('/answer', (req, res) => {
    res.sendFile(prevDir + "/views/answerQuestion.html");
});

router.get('/userManagement', (req, res) => {
    res.sendFile(prevDir + '/views/userManagement.html')
});

module.exports = router;