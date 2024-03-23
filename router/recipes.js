const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { recipeController, commentController } = require('../controllers');

// middleware that is specific to this router

router.get('/', recipeController.getRecipes);
router.post('/', auth(), recipeController.createRecipe);

router.get('/:recipeId', recipeController.getRecipe);
router.post('/:recipeId', auth(), commentController.createComment);
router.put('/:recipeId', auth(), recipeController.subscribe);
router.put('/:recipeId/comments/:commentId', auth(), commentController.editComment);
router.delete('/:recipeId/comments/:commentId', auth(), commentController.deleteComment);

// router.get('/my-trips/:id/reservations', auth(), recipeController.getReservations);

module.exports = router