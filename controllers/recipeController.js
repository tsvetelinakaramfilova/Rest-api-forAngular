const { recipeModel } = require("../models");
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
    .populate("products").populate("userId")
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

function deleteRecipe(req, res, next){
  // const { recipeId } = req.params;

  const { commentId, recipeId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
      recipeModel.findOneAndDelete({ _id: recipeId }),
        // userModel.findOneAndUpdate({ _id: userId }, { $pull: { comments: commentId } }),
        // commentModel.findOneAndUpdate({ _id: recipeId, userId }),
    ])
        .then(([deletedOne, _, __]) => {
            if (deletedOne) {
                res.status(200).json(deletedOne)
            } else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

function updatedRecipe(req, res, next) {
  const recipeId = req.params.recipeId;
  const { recipeName, category, products, image, description } = req.body;

  recipeModel
    .findByIdAndUpdate(
      { _id: recipeId },
      { recipeName, category, products, image, description } ,
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

  console.log("like");

  recipeModel
    .updateOne(
      { _id: recipeId },
      { $addToSet: { likes: userId } },
      { new: true }
    )
    .then(() => res.status(200).json({ message: "Liked successful!" }))
    .catch(next);
}

module.exports = {
  getRecipes,
  createRecipe,
  getRecipe,
  deleteRecipe,
  updatedRecipe,
  like,
};
