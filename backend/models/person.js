const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const personSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    midlename: { type: String, default: null },
    lastname: { type: String, required: true },
    contact: { type: String, default: null },
    gender: { type: String, default: null },
    address: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Person', personSchema);
