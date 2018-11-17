let db = require('../models');

module.exports = {
	createComment(req, res){
		db.Comment.create(req.body)
			.then(comment => {
				res.json(comment)
			})
			.catch(error => {
				res(send(error))
			})
	},
	getAllComment(req, res){
		db.Comment.find()
			.then(comments => {
				res.json(comments)
			})
			.catch(error => [
				res.send(error)
			])
	},
	updateComment(req, res){
		db.Comment.findByIdAndUpdate(req.params.commentID, req.body, {new: true})
			.then(updateComment => {
				res.json(updateComment)
			})
			.catch(error => {
				res.send(error)
			})
	},
    getCommentByQuestionID(req, res) {
        db.Comment.find({question: req.params.questionID}).populate('user', '-password')
            .then(comments => {
                res.json(comments)
            })
            .catch(error => {
                res.send(error)
            })
    }
};