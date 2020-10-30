const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String },
    done: { type: Boolean }
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;