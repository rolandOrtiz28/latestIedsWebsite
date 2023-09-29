const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeSchema = new Schema({
    description: String,
    amount: Number,
    status: {
        type: String,
        default: "Pending",
    },
});

module.exports = mongoose.model("Fee", feeSchema);