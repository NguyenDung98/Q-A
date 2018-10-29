let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
	comment: {
		type: String,
		required: 'Comment is required!'
	},
	voteUp: {
		type: Number,
		default: 0
	},
	voteDown: {
		type: Number,
		default: 0
	},
	user: {
		type: String,
		default: 'Ẩn danh'
	}
});

let Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;