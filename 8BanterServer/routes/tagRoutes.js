const express = require('express');
const router = express.Router();
const TagController = require('../controllers/TagController');

router.get('/', TagController.getAllTags);

router.post('/', TagController.createTag);

module.exports = router;