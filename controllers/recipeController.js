const { recipeModel } = require("../models");
const { newComment } = require("./commentController");

function getRecipes(req, res, next) {
  recipeModel
    .find()
    .populate("userId")
    .then((recipes) => res.json(recipes))
    .catch(next);
}

function getRecipe(req, res, next) {
  const { recipeId } = req.params;

  recipeModel
    .findById(recipeId)
    .populate({
      path: "comments",
      populate: {
        path: "userId",
      },
    })
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
    }).catch(next);

}

function subscribe(req, res, next) {
  const recipeId = req.params.recipeId;
  const { _id: userId } = req.user;
  recipeModel
    .findByIdAndUpdate(
      { _id: recipeId },
      { $addToSet: { subscribers: userId } },
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
  subscribe,
  like,
};
