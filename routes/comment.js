let router  = require('express').Router();

const commentHelper = require('../helpers/comment');
const sessionHelper = require("../helpers/session");
const questionHelper = require("../helpers/question");
const middleware = require("../middleware");

const apiRoute = '/api/answer';

router.route(`${apiRoute}/`)
	.get(commentHelper.getAllComment)
	.post(commentHelper.createComment);

router.route(`${apiRoute}/:commentID`)
	.put(commentHelper.updateComment);

router.route(`${apiRoute}/:questionID`)
	.get(commentHelper.getCommentByQuestionID);

// lấy tất cả các câu trả lời trong 1 câu hỏi
router.get('/session/:eventCode/question/:order', middleware.isLoggedIn ,async (req, res) => {
    try {
        const session = await sessionHelper.getSessionByID_server(req.query.id);
        const question = await questionHelper.getQuestionByID(req.query.question);
        if (!session) throw new Error('session not found');
        if (!question) throw new Error('question not found');
        if (question.session.toString() !== session._id.toString()) throw Error("This question is not in this session!");
        res.render('answerQuestion', {question, session, userInfo: req.session.userInfo, lastHref: req.headers.referer});
    } catch (error) {
        console.log(error);
        res.redirect('/session')
    }
});

module.exports = router;