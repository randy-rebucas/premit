const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordPrescriptionSchema = mongoose.Schema({
    prescriptions: [{
      maintenableFlg: { type: Boolean },
      medicine: { type: String, required: true },
      preparation: { type: String, required: true },
      sig: { type: String, required: true },
      quantity: { type: Number, required: true }
    }],
    created: { type: Date, default: Date.now },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Prescription', recordPrescriptionSchema);
