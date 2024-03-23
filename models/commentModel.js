const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
    descriptionComment: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
    recipeId: {
        type: ObjectId,
        ref: "Recipe"
    },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Comment', commentSchema);
