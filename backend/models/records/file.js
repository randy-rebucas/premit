const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordFileSchema = mongoose.Schema({
    filename: { type: String, required: true },
    size: { type: String, required: true },
    destination: { type: String, required: true },
    path: { type: String, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('File', recordFileSchema);
