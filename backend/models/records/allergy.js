const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordAllergySchema = mongoose.Schema({
    allergy: { type: String, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Allergy', recordAllergySchema);
