const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    email: {
        type: String, required: true
    },
    token: {
        type: String,
    }

}, { underscored: true, timestamps: false });


const password_reset = mongoose.model('password_reset', registerSchema);
module.exports = password_reset;