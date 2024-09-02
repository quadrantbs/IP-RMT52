const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/TemplateController');

router.get('/', TemplateController.getMemeTemplates);

module.exports = router;