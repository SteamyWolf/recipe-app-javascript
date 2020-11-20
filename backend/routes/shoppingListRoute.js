const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/shoppingListModel');

//Entered: /shopping

//ROUTES//
router.get('/', async (req, res) => {
    try {
        const shoppingLists = await ShoppingList.find()
        res.json(shoppingLists);
    }
    catch(err) {
        console.log(err)
    }
});

router.post('/', async (req, res) => {
    try {
        const shoppingList = new ShoppingList({
            title: req.body.title,
            ingredients: []
        })
        const saveShoppingList = await shoppingList.save();
        res.json(saveShoppingList);
    }
    catch(err) {
        console.log(err)
    }
});

//EXPORT
module.exports = router;
