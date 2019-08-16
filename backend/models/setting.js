const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const settingSchema = mongoose.Schema({
    config: [{
        key: { type: String, required: true },
        value: { type: String, required: true }
    }],
    section: { type: String }
});


module.exports = mongoose.model('Setting', settingSchema);