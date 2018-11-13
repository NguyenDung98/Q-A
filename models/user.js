let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'User is required!'
    },
    username: {
        type: String,
        required: 'User Name is required!'
    },
    role: {
        type: String,
        default: 'Student'
    },
    password: {
        type: String,
        required: 'Password is required!'
    }
});

let User = mongoose.model("User", userSchema);
module.exports = User;