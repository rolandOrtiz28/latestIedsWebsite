const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});


imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200');
})

const registrationSchema = new Schema({
    images: [imageSchema],
    student: {
        studentNumber: String,
        firstName: String,
        lastName: String,
        age: Number,
        address: String,
        gender: String,
        birthday: Date,
    },
    parents: {
        fatherName: String,
        motherName: String,
        motherOccupation: String,
        fatherOccupation: String,
        phoneNumber: Number
    },
    curriculum: String,
    yearLevel: String,
    status: {
        type: String,
        default: "Pending",
    },
    feeStatus: {
        type: String,
        default: "Pending",
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now, // This sets the default value to the current date and time
    },
    fee: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Fee'
        }

    ],
    grade: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Grade'
        }

    ]
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);