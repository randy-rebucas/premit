const express = require('express');

const PatientController = require('../controllers/patient');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, PatientController.createPatient); //extractFile,

router.put('/:id/:personId', checkAuth, PatientController.updatePatient); //extractFile,

router.get('', PatientController.getPatients);

router.get('/:id', PatientController.getPatient);

router.delete('/:id', checkAuth, PatientController.deletePatient);


module.exports = router;
