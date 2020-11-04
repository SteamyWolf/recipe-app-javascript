const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipeModel');

//ROUTES//
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
        res.json(recipes);
    }
    catch(err) {
        console.log(err)
    }
});

router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe({
            title: req.body.title,
            directions: req.body.directions,
            rating: req.body.rating,
            category: req.body.category,
            ingredients: []
        })
        const saveRecipe = await recipe.save();
        res.json(saveRecipe);
    }
    catch(err) {
        console.log(err)
    }
})

//EXPORT
module.exports = router;
