const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    name: String,
    amount: Number
})

module.exports = mongoose.model('Ingredient', ingredientSchema, 'ingredients');