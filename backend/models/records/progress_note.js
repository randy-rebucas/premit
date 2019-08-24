const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordProgressNoteSchema = mongoose.Schema({
  created: { type: Date },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  note: { type: String, required: true }
});

module.exports = mongoose.model('ProgressNote', recordProgressNoteSchema);
