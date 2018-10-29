let router  = require('express').Router(),
	helper = require('../helpers/answer'),
	db	   = require('../models');

router.route('/answer')
	.get(helper.getAllComment)
	.post(helper.createComment);
router.route('/:commentID')
	.put(helper.updateComment);
module.exports = router;