let router  = require('express').Router(),
	helper = require('../helpers/comment');

router.route('/')
	.get(helper.getAllComment)
	.post(helper.createComment);

router.route('/:commentID')
	.put(helper.updateComment);

router.route('/:questionID')
	.get(helper.getCommentByQuestionID);

module.exports = router;