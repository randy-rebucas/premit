const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    activated: { type: Boolean, default: 1 },
    banned: { type: Boolean, default: 0 },
    banReason: { type: String, default: null },
    lastIp: { type: String },
    createdAt: { type: Date, default: Date.now },
    licenseKey: { type: String },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
