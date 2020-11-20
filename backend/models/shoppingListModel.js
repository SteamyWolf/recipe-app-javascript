const mongoose = require('mongoose');

const shoppingListSchema = mongoose.Schema({
    title: String,
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    ]
})

module.exports = mongoose.model('ShoppingList', shoppingListSchema, 'shopping-list');