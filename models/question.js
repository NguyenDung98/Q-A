let mongoose = require('mongoose');

let questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: 'Question is required!'
    },
    vote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    postTime: Date,
    comment: {
        type: Number,
        default: 0
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order: Number
});

let Question = mongoose.model("Question", questionSchema);

module.exports = Question;