const express = require('express');

const PatientController = require('../controllers/patient');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/:recordType', checkAuth, PatientController.createPatient);

router.put('/:recordType/:id', checkAuth, PatientController.updatePatient);

router.get('/:recordType', PatientController.getPatients);

router.get('/:recordType/:id', PatientController.getPatient);

router.delete('/:recordType/:id', checkAuth, PatientController.deletePatient);

module.exports = router;