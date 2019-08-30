const express = require('express');

const UploadController = require('../controllers/upload');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// router.get('', UploadController.upload);

// router.get('/:key', SettingController.getSetting);

// router.put('/:id', checkAuth, SettingController.update);

router.post('', checkAuth, UploadController.upload);

// router.delete('/:id', checkAuth, SettingController.deleteSettings);


module.exports = router;
