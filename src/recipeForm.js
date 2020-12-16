const selectCategory = document.querySelector('#category');
const selectRating = document.querySelector('#rating');
const ulIngredients = document.querySelector('.ingredient-add');
const addIngredientButton = document.querySelector('.add-ingredient-button');
const submitButton = document.querySelector('.submit-button');
const form = document.querySelector('.form');
const userMessage = document.querySelector('.user-message')

async function getCategories() {
    const response = await fetch('https://recipe-app-wyatt.herokuapp.com/categories', {
        method: 'GET',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' }
    })
    const categories = response.json();
    return categories
}

getCategories().then(categories => {
    console.log(categories)
    populateSelectRating();
    populateSelectCategory(categories);
})

function populateSelectRating() {
    let options = ['1', '2', '3', '4', '5']
    for (let i = 0; i < options.length; i++) {
        let opt = options[i]
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectRating.appendChild(el);
    }
}

function populateSelectCategory(categories) {
    let options = categories
    for (let i = 0; i < options.length; i++) {
        let opt = options[i].category
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectCategory.appendChild(el);
    }
}


//ADD INGREDIENT
addIngredientButton.addEventListener('click', addIngredients)

function addIngredients() {
    let ingredientDiv = document.createElement('div')

    let ingredient = `
        <li class="form-ingredient-li">
            <label for="name">Ingredient Name:</label>
            <input type="text" id="name" name="name">

            <label for="amount">Amount:</label>
            <input type="number" id="amount" name="amount">
        </li>
    `;
    ingredientDiv.innerHTML = ingredient
    return ulIngredients.appendChild(ingredientDiv)
}


//SUBMIT BUTTON
submitButton.addEventListener('click', event => {
    event.preventDefault();
    grabFormData(event)
})

function grabFormData(event) {
    let title = document.querySelector('#title').value
    let directions = document.querySelector('#directions').value
    let rating = document.querySelector('#rating').value
    let category = document.querySelector('#category').value
    fetch('https://recipe-app-wyatt.herokuapp.com/recipes', {
        method: 'POST',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, directions: directions, rating: +rating, category: category })
    })
        .then(response => response.json())
        .then(recipe => {
            console.log(recipe)
            title.value = '';
            directions.value = '';
            let id = recipe._id
            let allLi = ulIngredients.getElementsByTagName('li')
            console.log(allLi)
            if (allLi) {
                for (let li of allLi) {
                    console.log(li)
                    let name = document.querySelector('#name').value
                    let amount = document.querySelector('#amount').value
                    fetch('https://recipe-app-wyatt.herokuapp.com/ingredients', {
                    method: 'POST',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name, amount: amount, recipeID: id })
                }).then(response => {
                    console.log(response)
                    console.log(name)
                    name.value = '';
                    amount.value = null; 
                    if (response.status === 200) {
                        userMessage.innerHTML = 'Recipe was successfully added to the database!'
                        setTimeout(() => {
                            userMessage.innerHTML = '';
                        }, 5000)
                    }
                })
            } 
        }
     })
}
