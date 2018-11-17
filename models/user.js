let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'User is required!'
    },
    username: {
        type: String,
        unique: true,
        required: 'username is required!'
    },
    role: {
        type: String,
        required: 'user must have a role!'
    },
    password: {
        type: String,
        required: 'Password is required!'
    }
});

let User = mongoose.model("User", userSchema);
module.exports = User;