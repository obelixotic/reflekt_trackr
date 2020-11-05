const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    last_login: { type: Number }
});

const User = mongoose.model('User', userSchema);

module.exports = User;