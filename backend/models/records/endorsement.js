const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordEndorsementSchema = mongoose.Schema({
    to: { type: String, required: true },
    content: { type: String, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Endorsement', recordEndorsementSchema);
