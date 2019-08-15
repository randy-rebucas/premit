const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordBloodPressureSchema = mongoose.Schema({
    systolic: { type: String, required: true },
    diastolic: { type: String, required: true },
    heartrate: { type: String, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('BloodPressure', recordBloodPressureSchema);
