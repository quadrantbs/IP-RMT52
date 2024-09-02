const express = require('express');
const router = express.Router();
const MemeController = require('../controllers/MemeController');

router.get('/', MemeController.getAllMemes);

router.get('/:id', MemeController.getMemeById);

router.post('/', MemeController.createMeme);

router.put('/:id', MemeController.updateMeme);

router.delete('/:id', MemeController.deleteMeme);

module.exports = router;