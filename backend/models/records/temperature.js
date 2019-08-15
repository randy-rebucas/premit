const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const recordTemperatureSchema = mongoose.Schema({
    temperature: { type: String, required: true },
    created: { type: Date },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongoose.model('Temperature', recordTemperatureSchema);
