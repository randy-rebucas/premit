const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const settingSchema = mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

module.exports = mongoose.model('Setting', settingSchema);
