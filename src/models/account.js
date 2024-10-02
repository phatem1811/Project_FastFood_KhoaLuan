const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema({
    phonenumber: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, 
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;