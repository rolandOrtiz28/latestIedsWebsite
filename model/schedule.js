const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scheduleSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reminders: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        isChecked: { type: Boolean, default: false },
        backgroundColor: {
            type: String,
            enum: ['Blue', 'Green', 'Red'],
            default: 'Blue', // You can set a default color here
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model('Schedule', scheduleSchema)
