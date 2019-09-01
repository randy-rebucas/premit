const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const patientSchema = mongoose.Schema({
    bloodType: { type: String, default: null },
    comments: { type: String, default: null },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Patient', patientSchema);
