const categoriesList = document.querySelector('.categories-list');
const ulOfCategories = document.querySelector('.li-list-category');
const recipeListDiv = document.querySelector('.recipes-list');
const allRecipes = document.querySelector('.allRecipes');

let editing = false;

const recipeFormLink = document.querySelector('.p-recipe-form')
recipeFormLink.addEventListener('click', event => {
    recipeFormLink.classList.add('active')
})

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
    //additions go here
})

let categoryArray = [];

function displayCategories(recipesWithIngredients) {
    let categories = new Set(recipesWithIngredients.map(recipe => recipe.category))
    console.log(categories)
    categories.forEach(category => {
        categoryArray.push(category)
        ulOfCategories.appendChild(createCategory(category))
    });
    fetch('http://localhost:3000/categories', {
        method: 'GET',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(categories => {
        console.log(categoryArray)
        console.log(categories)
        let DBCategory = []
        categories.forEach(category => DBCategory.push(category.category))
        console.log(DBCategory)
        // let categoriesNotEqual = categoryArray.filter(category => category !== categories.forEach(DBcategory => DBcategory.category))
        let filtered = categoryArray.filter(
            function(e) {
                return this.indexOf(e) < 0
            },
            DBCategory
        )
        console.log(filtered)
        if (filtered.length > 0) {
            filtered.forEach(category => {
                fetch('http://localhost:3000/categories', {
                    method: 'POST',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({category: category})
                })
            })
        }
    })
    
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
    // const recipeID = document.appendChild.querySelector('.hidden-recipe-id')
    const selectedRecipe = document.querySelectorAll('.editable')
    console.log(selectedRecipe)
    selectedRecipe.forEach(recipeField => {
        recipeField.contentEditable = true;
        recipeField.addEventListener('blur', (event) => {
            const fieldText = event.target.innerHTML
            console.log(fieldText);
            console.log(event)
            console.log(event.target)
    
            // const indexOfElement = [...event.target.parentElement.parentElement.parentElement.children].indexOf(event.target.parentElement.parentElement)
            // console.log(indexOfElement)
            const indexOfTitle = event.target.parentElement.children[0]
            const indexOfRating = event.target.parentElement.children[1]
            // const indexOfDescription = event.target.parentElement.children[1]
            console.log(indexOfTitle)
            console.log(indexOfRating)
            // console.log(indexOfDescription)
            if (event.target === indexOfTitle) {
                const id = event.target.parentElement.parentElement.children[3].innerHTML
                fetch('http://localhost:3000/recipes/title', {
                    method: 'PATCH',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({_id: id, title: fieldText})
                })
            } else if (event.target === indexOfRating) {
                const id = event.target.parentElement.parentElement.parentElement.children[3].innerHTML
                let ratingNumber = +fieldText
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
    const ingredientID = document.querySelector('.p-ingredient-id')

    const titleIngredients = document.querySelectorAll('.edit-title-ingredient');
    titleIngredients.forEach(titleIngredient => {
        titleIngredient.contentEditable = true;
        titleIngredient.addEventListener('blur', (event) => {
            console.log(event);
            const ingredientTitleText = event.target.innerHTML
            fetch('http://localhost:3000/ingredients/name', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: ingredientID.innerHTML, name: ingredientTitleText})
            })
        })
    })
    const amountIngredient = document.querySelectorAll('.edit-amount-ingredient');
    amountIngredient.forEach(amountIngredient => {
        amountIngredient.contentEditable = true;
        amountIngredient.addEventListener('blur', (event) => {
            console.log(event);
            const ingredientAmountNumber = event.target.innerHTML
            fetch('http://localhost:3000/ingredients/amount', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: ingredientID.innerHTML, amount: +ingredientAmountNumber})
            })
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

    let ratingDiv = document.createElement('div')
    ratingDiv.classList.add('rating-div')

    let ratingFillerText = document.createElement('p');
    ratingFillerText.textContent = 'Rating: '
    let ratingEndFillerText = document.createElement('p')
    ratingEndFillerText.textContent = '/5'

    let pRatingNumber = document.createElement('p');
    pRatingNumber.classList.add('editable')
    pRatingNumber.textContent = recipe.rating

    ratingDiv.appendChild(ratingFillerText)
    ratingDiv.appendChild(pRatingNumber);
    ratingDiv.appendChild(ratingEndFillerText)
    recipeHeaderDiv.appendChild(h2);
    recipeHeaderDiv.appendChild(ratingDiv)

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
        let pTitleIngredient = document.createElement('p')
        pTitleIngredient.classList.add('edit-title-ingredient')
        pTitleIngredient.textContent = ingredient.name

        let fillerText = document.createElement('p')
        fillerText.innerHTML = ' - '

        let pAmountIngredient = document.createElement('p')
        pAmountIngredient.classList.add('edit-amount-ingredient')
        pAmountIngredient.textContent = ingredient.amount

        //hidden ID for Ingredient
        let pIngredientId = document.createElement('p')
        pIngredientId.setAttribute('hidden', '')
        pIngredientId.classList.add('p-ingredient-id')
        pIngredientId.textContent = ingredient._id

        liIngredient.appendChild(pTitleIngredient)
        liIngredient.appendChild(fillerText)
        liIngredient.appendChild(pAmountIngredient)
        liIngredient.appendChild(pIngredientId)
        liListIngredientDiv.appendChild(liIngredient);
    })
    ingredientListDiv.appendChild(ingredientH3)
    ingredientListDiv.appendChild(liListIngredientDiv)
    recipeDiv.appendChild(ingredientListDiv)

    

    //hidden ID for Recipe
    let hiddenId = document.createElement('p')
    hiddenId.classList.add('hidden-recipe-id')
    hiddenId.setAttribute('hidden', '')
    hiddenId.innerHTML = recipe._id
    recipeDiv.appendChild(hiddenId)   
    
    //last append to main div
    recipeListDiv.appendChild(recipeDiv)
    
}

// function editRecipes(event, recipesWithIngredients) {
//     if (!editing) return;
    
// }