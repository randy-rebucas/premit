const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordComplaintSchema = mongoose.Schema({
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    complaints: [{
      complaint: { type: String }
    }]
});

module.exports = mongoose.model('Complaint', recordComplaintSchema);
