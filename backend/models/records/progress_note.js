const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordProgressNoteSchema = mongoose.Schema({
    progress_note: { type: String, required: true },
    created: { type: Date, default: Date.now },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('ProgressNote', recordProgressNoteSchema);