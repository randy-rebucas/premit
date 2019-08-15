const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordTestResultSchema = mongoose.Schema({
    test: { type: String, required: true },
    specimen: { type: String, required: true },
    conventional_unit: { type: String, required: true },
    si_unit: { type: Number, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('TestResult', recordTestResultSchema);
