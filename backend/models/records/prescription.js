const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordPrescriptionSchema = mongoose.Schema({
    complaint: { type: String },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    prescriptions: [{
      maintenableFlg: { type: Boolean },
      medicine: { type: String },
      preparation: { type: String },
      sig: { type: String },
      quantity: { type: Number }
    }]
});

module.exports = mongoose.model('Prescription', recordPrescriptionSchema);
