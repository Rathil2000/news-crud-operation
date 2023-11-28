const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const registerSchema = mongoose.Schema({

    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }

}, { underscored: true, timestamps: false });

registerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hash(this.password, 12);

    };
    next();
})

const Register = mongoose.model('register', registerSchema);
module.exports = Register;