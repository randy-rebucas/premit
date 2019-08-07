const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordTemperatureSchema = mongoose.Schema({
    temperature: { type: String, required: true },
    created: { type: Date, default: Date.now },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Temperature', recordTemperatureSchema);