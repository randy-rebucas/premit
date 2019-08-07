const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordRespiratoryRateSchema = mongoose.Schema({
    breaths: { type: String, required: true },
    created: { type: Date, default: Date.now },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('RespiratoryRate', recordRespiratoryRateSchema);