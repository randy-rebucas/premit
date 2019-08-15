var express = require('express');

const DriveController = require('../controllers/drive');

var router = express.Router();

/* GET home page. */
router.get('', DriveController.get);

module.exports = router;
