const express = require('express');

const PatientController = require('../controllers/patient');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extractFile, PatientController.createPatient);

router.put('/:id', checkAuth, extractFile, PatientController.updatePatient);

router.get('', PatientController.getPatients);

router.get('/:id', PatientController.getPatient);

router.delete('/:id', checkAuth, PatientController.deletePatient);


module.exports = router;