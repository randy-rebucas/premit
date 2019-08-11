const express = require('express');

const HeightController = require('../../controllers/records/height');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, HeightController.create);

router.put('/:id', checkAuth, HeightController.update);

router.get('', HeightController.getAll);

router.get('/:id', HeightController.get);

router.delete('/:id', checkAuth, HeightController.delete);


module.exports = router;
