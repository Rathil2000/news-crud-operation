const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    title: {
        type: String, required: true
    },
    content: {
        type: String, required: true
    },
    date: {
        type: Date, default: Date.now
    },
    token: {
        type: String,
    }

}, { underscored: true, timestamps: false });


const News = mongoose.model('news', registerSchema);
module.exports = News;