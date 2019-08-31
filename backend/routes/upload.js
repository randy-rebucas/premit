const express = require('express');

const UploadController = require('../controllers/upload');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', UploadController.getAll);

router.get('/:id', UploadController.get);

router.get('/latest', UploadController.getCurrent);

router.get('/complaint/:complaintId', UploadController.getByComplaint);

// router.put('/:id', checkAuth, SettingController.update);

router.post('', checkAuth, UploadController.upload);

router.delete('/:id', checkAuth, UploadController.delete);


module.exports = router;
