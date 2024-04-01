const { recipeModel, userModel, commentModel } = require("../models");
const { newComment } = require("./commentController");

function getRecipes(req, res, next) {
  const limit = Number(req.query.limit) || 0;

  recipeModel
    .find()
    .sort({ created_at: -1 })
    .limit(limit)
    .then((recipes) => res.json(recipes))
    .catch(next);
}

function getRecipe(req, res, next) {
  const { recipeId } = req.params;

  recipeModel
    .findById(recipeId)
    .populate("products")
    .populate("userId")
    .populate("likedList")
    .then((recipe) => res.json(recipe))
    .catch(next);
}

function createRecipe(req, res, next) {
  const { recipeName, category, products, image, description } = req.body;
  const { _id: userId } = req.user;

  recipeModel
    .create({
      recipeName,
      category,
      products,
      image,
      description,
      userId,
    })
    .then((recipe) => {
      res.status(201).json(recipe);
    })
    .catch(next);
}

async function deleteRecipe(req, res, next) {
  const { recipeId } = req.params;

  try {
    const deletedRecipe = await recipeModel.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    await userModel.updateMany(
      { likedRecipes: recipeId },
      { $pull: { likedRecipes: recipeId } }
    );
    await commentModel.deleteMany({ recipeId });

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

function updatedRecipe(req, res, next) {
  const recipeId = req.params.recipeId;
  const { recipeName, category, products, image, description } = req.body;

  recipeModel
    .findByIdAndUpdate(
      { _id: recipeId },
      { recipeName, category, products, image, description },
      { new: true }
    )
    .then((updatedRecipe) => {
      res.status(200).json(updatedRecipe);
    })
    .catch(next);
}

function like(req, res, next) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { likedRecipes: recipeId } }
    ),
    recipeModel.findOneAndUpdate(
      { _id: recipeId },
      { $push: { likedList: userId } }
    ),
  ])
    .then(() => res.status(200).json({ message: "Liked successful!" }))
    .catch(next);

}

function dislike(req, res, next) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { likedRecipes: recipeId } }
    ),
    recipeModel.findOneAndUpdate(
      { _id: recipeId },
      { $pull: { likedList: userId } }
    ),
  ])
    .then(() => res.status(200).json({ message: "Disliked successful!" }))
    .catch(next);
}

module.exports = {
  getRecipes,
  createRecipe,
  getRecipe,
  deleteRecipe,
  updatedRecipe,
  like,
  dislike,
};
