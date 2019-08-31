const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const attachmentSchema = mongoose.Schema({
  path: { type: String },
  name: { type: String },
  type: { type: String },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attachments', attachmentSchema);
