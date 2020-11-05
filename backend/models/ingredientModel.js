const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    name: String,
    amount: Number,
    recipeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }
})

module.exports = mongoose.model('Ingredient', ingredientSchema, 'ingredients');