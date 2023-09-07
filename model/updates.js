const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const domPurify = require('dompurify')
const { JSDOM } = require('jsdom');
const htmlPurify = domPurify(new JSDOM().window)
const mongoosePaginate = require('mongoose-paginate-v2');

const imageSchema = new Schema({
    url: String,
    filename: String
});


imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200');
})
const updateSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    images: [imageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    subDescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });


updateSchema.plugin(mongoosePaginate);//trial


module.exports = mongoose.model('Update', updateSchema)