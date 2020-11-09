const categoriesList = document.querySelector('.categories-list');
const ulOfCategories = document.querySelector('.li-list-category');
const recipeListDiv = document.querySelector('.recipes-list');
const allRecipes = document.querySelector('.allRecipes');

let editing = false;

async function getRecipes() {
    const response = await fetch('http://localhost:3000/recipes', {
        method: 'GET',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
    });
    const recipes = response.json();
    return recipes
}


getRecipes().then(async recipes => {
    console.log(recipes)
    
    let recipesWithIngredients = await recipes.map(recipe => {
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
    // await recipesWithIngredients;
    console.log(recipesWithIngredients)
    displayCategories(recipesWithIngredients)
    allRecipesClick(recipesWithIngredients)
    // editRecipes(recipesWithIngredients);
    //additions go here
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

//EVENT LISTENERS
function categoryClick(recipesWithIngredients) {
    const categoryItem = document.querySelectorAll('.category-item');
    categoryItem.forEach(category => {
        category.addEventListener('click', (event) => {
            // const indexOfElement = [...event.target.parentElement.children].indexOf(event.target)
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

function editRecipes(recipesWithIngredients) {
    console.log(recipesWithIngredients)
    const selectedRecipeH2 = document.querySelectorAll('.h2-recipe')
    console.log(selectedRecipeH2)
    selectedRecipeH2.forEach(recipeH2 => {
        recipeH2.addEventListener('click', (event) => {
            const h2Click = event.target.innerHTML
            console.log(h2Click);
        })
    })
    
}
//end



function displayRecipes(recipesWithIngredients, categoryName) {
    while (recipeListDiv.firstChild) {
        recipeListDiv.removeChild(recipeListDiv.firstChild)
    }
    //Called when a category is clicked that is not the 'ALL' category:
    if (recipesWithIngredients.find(recipe => recipe.category.includes(categoryName))) {
        recipesWithIngredients.forEach(recipe => {
            if (recipe.category === categoryName) {
                createRecipe(recipe)
            }
        })
        editRecipes(recipesWithIngredients)
    }
    
    //Called when allRecipes category is clicked:
    if (!categoryName) {
        recipesWithIngredients.forEach(recipe => {
            createRecipe(recipe)
        })
        editRecipes(recipesWithIngredients)
    }
}

function createRecipe(recipe) {
    console.log(recipe)
    let recipeDiv = document.createElement('div')
    recipeDiv.className = 'recipe';
    let recipeHeaderDiv = document.createElement('div')
    recipeHeaderDiv.className = 'recipe-header';
    let h2 = document.createElement('h2');
    h2.className = 'h2-recipe'
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

// function editRecipes(event, recipesWithIngredients) {
//     if (!editing) return;
    
// }