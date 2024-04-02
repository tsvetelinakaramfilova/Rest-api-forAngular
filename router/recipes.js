const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { recipeController, commentController } = require('../controllers');

// middleware that is specific to this router

router.get('/', recipeController.getRecipes);
router.get('/last', recipeController.getLastRecipes);
router.post('/', auth(), recipeController.createRecipe);

router.get('/:recipeId', recipeController.getRecipe);
router.put('/:recipeId', auth(), recipeController.updatedRecipe);
router.delete('/:recipeId', auth(), recipeController.deleteRecipe);
// router.get('/my-trips/:id/reservations', auth(), recipeController.getReservations);

module.exports = router