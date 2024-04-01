const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { commentController } = require('../controllers');

// middleware that is specific to this router

router.get('/:recipeId', commentController.getComments);
router.post('/', auth(), commentController.createComment);
router.delete('/:recipeId/:commentId', auth(), commentController.deleteComment);
// router.put('/:recipeId/comments/:commentId', auth(), commentController.editComment);
// router.get('/', commentController.getLatestsComments);

module.exports = router