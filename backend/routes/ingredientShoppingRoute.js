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
            complete: false,
            shoppingListID: req.body.shoppingListID
        })
        const saveIngredient = await ingredient.save();
        res.json(saveIngredient);
    }
    catch(err) {
        console.log(err)
    }
});

router.get('/ingredientsByShoppingList/:shoppingListID', async (req, res) => {
    try {
        await IngredientShopping.find({ shoppingListID: req.params.shoppingListID})
            .exec((err, ingredients) => {
                res.json(ingredients)
            })
    }
    catch (err) {
        res.json(err)
    }
});

router.patch('/amount', async (req, res) => {
    console.log(req.body)
    try {
        const ingredientAmountUpdate = await IngredientShopping.findOneAndUpdate({_id: req.body._id}, {$set: {amount: req.body.amount}});
        res.json(ingredientAmountUpdate)
    }
    catch(error) {
        console.log(error);
    }
});

router.patch('/complete', async (req, res) => {
    console.log(req.body)
    try {
        const ingredientAmountUpdate = await IngredientShopping.findOneAndUpdate({_id: req.body._id}, {$set: {complete: req.body.complete}});
        res.json(ingredientAmountUpdate)
    }
    catch(error) {
        console.log(error);
    }
});

router.delete('/delete', async (req, res) => {
    try {
        let deletedIngredient = await IngredientShopping.findOneAndDelete({_id: req.body._id});
        res.json(deletedIngredient);
    }
    catch(err) {
        console.log(err)
    }
})

//EXPORT
module.exports = router;
