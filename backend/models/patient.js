const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const patientSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  midlename: { type: String, required: true },
  lastname: { type: String, required: true },
  contact: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Patient', patientSchema);
