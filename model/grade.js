const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
    description: String,
    rating: Number,

});

module.exports = mongoose.model("Grade", gradeSchema);