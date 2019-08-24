const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordAssessmentSchema = mongoose.Schema({
    created: { type: Date },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    diagnosis: [{
        diagnose: { type: String }
    }],
    treatments: [{
        treatment: { type: String }
    }]
});

module.exports = mongoose.model('Assessment', recordAssessmentSchema);
