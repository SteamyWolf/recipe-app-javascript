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
        res.json(err)
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
        res.json(err)
    }
});

router.patch('/title', async (req, res) => {
    try {
        const shoppingListUpdate = await ShoppingList.findOneAndUpdate({_id: req.body._id}, {$set: {title: req.body.title}});
        res.json(shoppingListUpdate)
    }
    catch(error) {
        console.log(error);
        res.json(error)
    }
});

router.delete('/delete', async (req, res) => {
    try {
        let deletedShoppingList = await ShoppingList.findOneAndDelete({_id: req.body._id});
        res.json(deletedShoppingList);
    }
    catch(err) {
        console.log(err)
        res.json(err)
    }
})

//EXPORT
module.exports = router;
