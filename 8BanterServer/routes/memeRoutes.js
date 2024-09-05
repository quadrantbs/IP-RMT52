const express = require("express");
const router = express.Router();
const MemeController = require("../controllers/MemeController");
const authenticate = require("../middlewares/authenticate");
const { authorizeMeme } = require("../middlewares/authorization");

router.get('/', MemeController.getAllMemes);

router.get('/:id', MemeController.getMemeById);

router.get('/tag/:tag', MemeController.getMemesByTag);

router.post('/', authenticate, MemeController.createMeme);

router.put('/:id', authenticate, authorizeMeme, MemeController.updateMeme);

router.delete('/:id', authenticate, authorizeMeme, MemeController.deleteMeme);

module.exports = router;
