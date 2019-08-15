const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordDiagnoseSchema = mongoose.Schema({
    diagnose: { type: String, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Diagnose', recordDiagnoseSchema);
