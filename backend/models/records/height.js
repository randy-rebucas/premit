const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordHeightSchema = mongoose.Schema({
    height: { type: String, required: true },
    created: { type: String, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Height', recordHeightSchema);
