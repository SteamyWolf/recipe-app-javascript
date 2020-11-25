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

router.patch('/name', async (req, res) => {
    console.log(req.body)
    try {
        const ingredientNameUpdate = await Ingredient.findOneAndUpdate({_id: req.body._id}, {$set: {name: req.body.name}});
        res.json(ingredientNameUpdate)
    }
    catch(error) {
        console.log(error);
    }
})

router.patch('/amount', async (req, res) => {
    console.log(req.body)
    try {
        const ingredientAmountUpdate = await Ingredient.findOneAndUpdate({_id: req.body._id}, {$set: {amount: req.body.amount}});
        res.json(ingredientAmountUpdate)
    }
    catch(error) {
        console.log(error);
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
});

router.delete('/delete', async (req, res) => {
    try {
        let deletedIngredient = await Ingredient.findOneAndDelete({_id: req.body._id});
        res.json(deletedIngredient);
    }
    catch(err) {
        console.log(err)
    }
})

//EXPORT
module.exports = router;
