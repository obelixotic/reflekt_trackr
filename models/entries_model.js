const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    habit_id: { type: String, required: true },
    done: { type: Boolean }
}, { timestamps: true });

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;