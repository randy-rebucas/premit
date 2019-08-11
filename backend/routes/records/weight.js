const express = require('express');

const Controller = require('../../controllers/records/weight');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:id', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/:id', Controller.get);

router.delete('/:id', checkAuth, Controller.delete);

module.exports = router;
