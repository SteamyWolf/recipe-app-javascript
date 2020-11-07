const categoriesList = document.querySelector('.categories-list');
const ulOfCategories = document.querySelector('.li-list-category');
const recipeListDiv = document.querySelector('.recipes-list');
const allRecipes = document.querySelector('.allRecipes');

async function getRecipes() {
    const response = await fetch('http://localhost:3000/recipes', {
        method: 'GET',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
    });
    const recipes = response.json();
    return recipes
}


getRecipes().then(recipes => {
    console.log(recipes)
    
    let recipesWithIngredients = recipes.map(recipe => {
        fetch(`http://localhost:3000/ingredients/ingredientsByRecipe/${recipe._id}`, {
            method: 'GET',
            headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(ingredients => {
            recipe.ingredients.push(ingredients)
        })
        return recipe
    })
    console.log(recipesWithIngredients)
    displayCategories(recipesWithIngredients)
    allRecipesClick(recipesWithIngredients)
})

function displayCategories(recipesWithIngredients) {
    let categories = new Set(recipesWithIngredients.map(recipe => recipe.category))
    console.log(categories)
    categories.forEach(category => {
        ulOfCategories.appendChild(createCategory(category))
    });
    categoryClick(recipesWithIngredients);
}
function createCategory(category) {
    let li = document.createElement('li')
    li.className = 'category-item'
    li.textContent = category
    return li
}

//Event Listeners
function categoryClick(recipesWithIngredients) {
    const categoryItem = document.querySelectorAll('.category-item');
    categoryItem.forEach(category => {
        category.addEventListener('click', (event) => {
            const indexOfElement = [...event.target.parentElement.children].indexOf(event.target)
            const categoryName = event.target.innerHTML
            displayRecipes(recipesWithIngredients, categoryName)
        })
    })
    
}
function allRecipesClick(recipesWithIngredients) {
    allRecipes.addEventListener('click', event => {
        console.log(event)
        displayRecipes(recipesWithIngredients, '');
    })
}



function displayRecipes(recipesWithIngredients, categoryName) {
    while (recipeListDiv.firstChild) {
        recipeListDiv.removeChild(recipeListDiv.firstChild)
    }
    recipesWithIngredients.forEach(recipe => {
        if (recipe.category === categoryName) {
            createRecipe(recipe)
        }
    })
    if (!categoryName) {
        recipesWithIngredients.forEach(recipe => {
            createRecipe(recipe)
        })
    }
}

function createRecipe(recipe) {
    console.log(recipe)
    let recipeDiv = document.createElement('div')
    recipeDiv.className = 'recipe';
    let recipeHeaderDiv = document.createElement('div')
    recipeHeaderDiv.className = 'recipe-header';
    let h2 = document.createElement('h2');
    let p = document.createElement('p');
    h2.textContent = recipe.title;
    p.textContent = 'Rating: ' + recipe.rating + '/5';
    recipeHeaderDiv.appendChild(h2);
    recipeHeaderDiv.appendChild(p);

    let pDescription = document.createElement('p')
    pDescription.className = 'description'
    pDescription.textContent = recipe.directions
    recipeDiv.appendChild(recipeHeaderDiv)
    recipeDiv.appendChild(pDescription)

    let ingredientListDiv = document.createElement('div')
    ingredientListDiv.className = 'ingredient-list'

    let ingredientH3 = document.createElement('h3')
    ingredientH3.textContent = 'Ingredients:'

    let liListIngredientDiv = document.createElement('div')
    liListIngredientDiv.className = 'li-list-ingredient'
    recipe.ingredients[0].forEach(ingredient => {
        let liIngredient = document.createElement('li')
        liIngredient.textContent = ingredient.name + ' - ' + ingredient.amount
        liListIngredientDiv.appendChild(liIngredient);
    })
    ingredientListDiv.appendChild(ingredientH3)
    ingredientListDiv.appendChild(liListIngredientDiv)
    recipeDiv.appendChild(ingredientListDiv)
    
    recipeListDiv.appendChild(recipeDiv)
}