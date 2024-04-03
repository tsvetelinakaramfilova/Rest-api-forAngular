const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const recipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    timeToCook: {
      type: Number,
      required: true,
    },
    products: [
      {
        quantity: Number,
        product: String,
      },
    ],
    image: {
      type: String,
      match: /^https?:\/\//,
    },
    description: {
      type: String,
      required: true,
    },
    likedList: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    userId: {
      type: ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Recipe", recipeSchema);
