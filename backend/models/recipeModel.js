const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title: String,
    directions: String,
    rating: Number,
    category: String,
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    ]
})

module.exports = mongoose.model('Recipe', recipeSchema, 'recipes');