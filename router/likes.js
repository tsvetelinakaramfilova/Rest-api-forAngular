const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { recipeController } = require('../controllers');

// middleware that is specific to this router

router.put('/:recipeId', auth(), recipeController.like);
router.put('/dislikes/:recipeId', auth(), recipeController.dislike);

module.exports = router
