const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeSchema = new Schema({
    description: String,
    amount: Number,
    status: {
        type: String,
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now, // This sets the default value to the current date and time
    },
}, { timestamps: true });

module.exports = mongoose.model("Fee", feeSchema);