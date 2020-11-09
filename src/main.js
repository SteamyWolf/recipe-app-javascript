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
    const selectedRecipe = document.querySelectorAll('.editable')
    console.log(selectedRecipe)
    selectedRecipe.forEach(recipeField => {
        recipeField.contentEditable = true;
        recipeField.addEventListener('blur', (event) => {
            const fieldText = event.target.innerHTML
            console.log(fieldText);
            console.log(event)
            console.log(event.target)
            const id = event.target.parentElement.parentElement.children[3].innerHTML
            // const indexOfElement = [...event.target.parentElement.parentElement.parentElement.children].indexOf(event.target.parentElement.parentElement)
            // console.log(indexOfElement)
            const indexOfTitle = event.target.parentElement.children[0]
            const indexOfRating = event.target.parentElement.children[1]
            // const indexOfDescription = event.target.parentElement.children[1]
            console.log(indexOfTitle)
            console.log(indexOfRating)
            // console.log(indexOfDescription)
            console.log(id)
            if (event.target === indexOfTitle) {
                fetch('http://localhost:3000/recipes/title', {
                    method: 'PATCH',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({_id: id, title: fieldText})
                })
            } else if (event.target === indexOfRating) {
                let ratingNumber = +fieldText[8]
                //TODO: Fix this so that the user can only edit the number. It will probably be in the createRecipe function
                fetch('http://localhost:3000/recipes/rating', {
                    method: 'PATCH',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({_id: id, rating: ratingNumber})
                })
            }
            
        })
    })
    const descriptions = document.querySelectorAll('.description');
    descriptions.forEach(description => {
        description.contentEditable = true;
        description.addEventListener('blur', (event) => {
            console.log(event)
            const descriptionText = event.target.innerHTML
            const id = event.target.parentElement.children[3].innerHTML;
            console.log(id, descriptionText)
            fetch('http://localhost:3000/recipes/directions', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: id, description: descriptionText})
            })
        })
    })
    const ingredients = document.querySelectorAll('.edit-ingredient');
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('blur', event => {
            console.log(event);
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
    h2.classList.add('h2-recipe', 'editable');
    h2.textContent = recipe.title;

    let p = document.createElement('p');
    p.classList.add('editable')
    p.textContent = 'Rating: ' + recipe.rating + '/5';
    recipeHeaderDiv.appendChild(h2);
    recipeHeaderDiv.appendChild(p);

    let pDescription = document.createElement('p')
    pDescription.classList.add('description');
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
        liIngredient.classList.add('edit-ingredient')
        liIngredient.textContent = ingredient.name + ' - ' + ingredient.amount
        liListIngredientDiv.appendChild(liIngredient);
    })
    ingredientListDiv.appendChild(ingredientH3)
    ingredientListDiv.appendChild(liListIngredientDiv)
    recipeDiv.appendChild(ingredientListDiv)

    //hidden ID
    let hiddenId = document.createElement('p')
    hiddenId.setAttribute('hidden', '')
    hiddenId.innerHTML = recipe._id
    recipeDiv.appendChild(hiddenId)   
    
    //last append to main div
    recipeListDiv.appendChild(recipeDiv)
    
}

// function editRecipes(event, recipesWithIngredients) {
//     if (!editing) return;
    
// }