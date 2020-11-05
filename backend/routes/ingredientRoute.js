const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredientModel');

//ROUTES//
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find()
        res.json(ingredients);
    }
    catch(err) {
        console.log(err)
    }
});

router.post('/', async (req, res) => {
    try {
        const ingredient = new Ingredient({
            name: req.body.name,
            amount: req.body.amount,
            recipeID: req.body.recipeID
        })
        const saveIngredient = await ingredient.save();
        res.json(saveIngredient);
    }
    catch(err) {
        console.log(err)
    }
})

router.get('/ingredientsByRecipe/:recipeID', async (req, res) => {
    try {
        await Ingredient.find({ recipeID: req.params.recipeID })
        .exec((err, ingredients) => {
            res.json(ingredients)
        })
    } catch(err) {
        res.json(err)
    }
})

//EXPORT
module.exports = router;
