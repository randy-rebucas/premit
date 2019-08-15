const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordWeightSchema = mongoose.Schema({
    weight: { type: String, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Weight', recordWeightSchema);
