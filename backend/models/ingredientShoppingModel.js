const mongoose = require('mongoose');

const ingredientShoppingSchema = mongoose.Schema({
    name: String,
    amount: Number,
    shoppingListID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShoppingList'
    }
})

module.exports = mongoose.model('IngredientShopping', ingredientShoppingSchema, 'ingredients-shopping');