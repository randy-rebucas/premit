const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordPrescriptionSchema = mongoose.Schema({
    created: { type: Date },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    prescriptions: [{
      maintenableFlg: { type: Boolean },
      medicine: { type: String },
      preparation: { type: String },
      sig: { type: String },
      quantity: { type: Number }
    }]
});

module.exports = mongoose.model('Prescription', recordPrescriptionSchema);
