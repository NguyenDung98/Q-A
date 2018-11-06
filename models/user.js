let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	user: {
		type: String,
		required: 'User is required!'
	},
	role: {
		type: String,
		default: 'Student'
	}
});

let User = mongoose.model("User", userSchema);
module.exports = User;