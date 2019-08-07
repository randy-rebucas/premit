const express = require('express');

const SettingController = require('../controllers/setting');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.get('', SettingController.getSettings);

router.delete('/:id', checkAuth, SettingController.deleteSettings);


module.exports = router;