const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const avatarSchema = mongoose.Schema({
    imagePath: { type: String, required: true },
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Avatar', avatarSchema);
