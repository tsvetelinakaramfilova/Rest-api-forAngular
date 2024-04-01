const { userModel, recipeModel, commentModel } = require("../models");

function getComments(req, res, next) {
  const { recipeId } = req.params;

  commentModel
    .find({ recipeId })
    .populate("userId")
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch(next);
}

// function getLatestsComments(req, res, next) {
//     const limit = Number(req.query.limit) || 0;

//     commentModel.find()
//         .sort({ created_at: -1 })
//         .limit(limit)
//         .populate('recipeId userId')
//         .then(comments => {
//             res.status(200).json(comments)
//         })
//         .catch(next);
// }

function newComment(descriptionComment, userId, recipeId) {
  return commentModel
    .create({ descriptionComment, userId, recipeId })
    .then((comment) => {
      return Promise.all([
        recipeModel.findByIdAndUpdate(
          { _id: recipeId },
          {
            $push: { comments: comment._id },
          }
        ),
      ]);
    });
}

function createComment(req, res, next) {
  const { recipeId, descriptionComment } = req.body;
  const { _id: userId } = req.user;

  newComment(descriptionComment, userId, recipeId)
    .then((comment) => res.status(201).json(comment))
    .catch(next);
}

// function editComment(req, res, next) {
//   const { commentId } = req.params;
//   const { commentText } = req.body;
//   const { _id: userId } = req.user;

//   // if the userId is not the same as this one of the comment, the comment will not be updated
//   commentModel
//     .findOneAndUpdate(
//       { _id: commentId, userId },
//       { text: commentText },
//       { new: true }
//     )
//     .then((updatedComment) => {
//       if (updatedComment) {
//         res.status(200).json(updatedComment);
//       } else {
//         res.status(401).json({ message: `Not allowed!` });
//       }
//     })
//     .catch(next);
// }

function deleteComment(req, res, next) {
  const { commentId, recipeId } = req.params;
//   const { _id: userId } = req.user;

  Promise.all([
    commentModel.findOneAndDelete({ _id: commentId }),
    // userModel.findOneAndUpdate({ _id: userId }, { $pull: { comments: commentId } }),
    recipeModel.findOneAndUpdate(
      { _id: recipeId },
      { $pull: { comments: commentId } }
    ),
  ])
    .then(([deletedOne, _, __]) => {
      if (deletedOne) {
        res.status(200).json(deletedOne);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch(next);
}

module.exports = {
  getComments,
  // getLatestsComments,
  newComment,
  createComment,
//   editComment,
  deleteComment,
};
