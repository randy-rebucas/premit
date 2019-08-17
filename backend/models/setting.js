const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const settingSchema = mongoose.Schema({
  client_id: { type: String, required: true },
  clinic_owner: { type: String, required: true },
  clinic_name: { type: String },
  clinic_address: { type: String },
  clinic_email: { type: String },
  clinic_url: { type: String },
  prc: { type: String },
  ptr: { type: String },
  s2: { type: String },
  clinic_phone: [{
    contact: { type: String }
  }],
  clinic_hours: [{
    morning_open: { type: String },
    morning_close: { type: String },
    afternoon_open: { type: String },
    afternoon_close: { type: String }
  }]
});


module.exports = mongoose.model('Setting', settingSchema);
