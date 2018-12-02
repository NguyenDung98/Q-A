let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
	comment: {
		type: String,
		required: 'Comment is required!'
	},
	voteUp: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	voteDown: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	}],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	},
	postTime: Date,
	isRightAnswer: Boolean
});

let Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;