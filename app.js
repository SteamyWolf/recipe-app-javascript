const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv/config')
const recipeRoute = require('./backend/routes/recipeRoute');
const ingredientRoute = require('./backend/routes/ingredientRoute');

// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

const port = process.env.PORT || 3000
app.use(cors());

//Middleware//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES
app.get('/hi', (req, res) => {
    res.send('Working?')
})

app.use('/recipes', recipeRoute);
app.use('/ingredients', ingredientRoute);


//CONNECTION TO DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true,  useUnifiedTopology: true});

//LISTENING
app.listen(port, () => {
    console.log(`Recipes App listening on port ${port}`)
})