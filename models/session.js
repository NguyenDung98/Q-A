let mongoose = require('mongoose');

let sessionSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: 'Name event is required!'
    },
    eventCode: {
        type: String,
        required: 'Event code is required!'
    },
    beginDate: {
        type: Date,
        required: 'Begin date is required!'
    },
    endDate: {
        type: Date,
        required: 'End date is required!'
    },
    // postTime: Date
});

let Session = mongoose.model("Session", sessionSchema);

module.exports = Session;