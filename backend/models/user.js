const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    activated: { type: Boolean, default: 1 },
    banned: { type: Boolean, default: 0 },
    ban_reason: { type: String, default: null },
    last_ip: { type: String },
    created_at: { type: Date, default: Date.now },
    license_key: { type: String }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);