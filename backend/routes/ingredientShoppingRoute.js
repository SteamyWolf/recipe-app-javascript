const express = require('express');
const router = express.Router();
const IngredientShopping = require('../models/ingredientShoppingModel');

//ROUTES//
router.get('/', async (req, res) => {
    try {
        const ingredientsShopping = await IngredientShopping.find()
        res.json(ingredientsShopping);
    }
    catch(err) {
        console.log(err)
    }
});

router.post('/', async (req, res) => {
    try {
        const ingredient = new IngredientShopping({
            name: req.body.name,
            amount: req.body.amount,
            shoppingListID: req.body.shoppingListID
        })
        const saveIngredient = await ingredient.save();
        res.json(saveIngredient);
    }
    catch(err) {
        console.log(err)
    }
})

//EXPORT
module.exports = router;
