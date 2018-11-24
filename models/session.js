let mongoose = require('mongoose');

let sessionSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: 'Name event is required!'
    },
    eventCode: {
        type: String,
        required: 'Event code is required!',
        unique: true
    },
    beginDate: {
        type: Date,
        required: 'Begin date is required!'
    },
    endDate: {
        type: Date,
        required: 'End date is required!'
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    survey: {
        isCreated: {
            type: Boolean,
            default: false
        },
        data: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            answer: Number,
            feedback: String
        }]
    }
});

let Session = mongoose.model("Session", sessionSchema);

module.exports = Session;