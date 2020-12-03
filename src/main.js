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
    console.log(recipesWithIngredients)
    displayCategories(recipesWithIngredients)
    allRecipesClick(recipesWithIngredients)
    addNewCategory(recipesWithIngredients);
})

let categoryArray = [];
let globalDBCategory;

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
        globalDBCategory = DBCategory
        let differences = DBCategory.filter(category => !categoryArray.includes(category))
        console.log(differences)
        differences.forEach(filteredCategory => ulOfCategories.appendChild(createCategory(filteredCategory)))
        categoryClick(recipesWithIngredients);
    })
    
}
function createCategory(category) {
    let li = document.createElement('li')
    li.className = 'category-item'
    li.textContent = category
    return li
}

//ADD NEW
function addNewCategory(recipesWithIngredients) {
    let categoryInput = document.querySelector('.new-category-input');
    const addCategoryDiv = document.querySelector('.add-category-div')
    const button = document.createElement('button')
    button.textContent = 'Add'
    categoryInput.addEventListener('focus', event => {
        categoryInput.value = '';
        addCategoryDiv.appendChild(button)
    })
    button.addEventListener('mousedown', event => {
        console.log(categoryInput.value)
        // categoryArray.push(categoryInput.value)
        // displayCategories(recipesWithIngredients)
        globalDBCategory.push(categoryInput.value)
        ulOfCategories.appendChild(createCategory(categoryInput.value))
        fetch('http://localhost:3000/categories', {
            method: 'POST',
            headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
            body: JSON.stringify({category: categoryInput.value})
        })
        categoryClick(recipesWithIngredients, globalDBCategory)
    })
    categoryInput.addEventListener('blur', event => {
        categoryInput.value = 'Add New'
        addCategoryDiv.removeChild(button)
    })
}

function addNewIngredient(recipesWithIngredients) {
    const showIngredientButtonAll = document.querySelectorAll('.show-ingredient-button');
    showIngredientButtonAll.forEach(showIngredientButton => {
        showIngredientButton.addEventListener('click', event => {
            console.log(event)
            console.log(event.target.parentElement)
            const ingredientListDiv = event.target.parentElement
            showIngredientButton.setAttribute('hidden', '');
            let ingredientTitle = document.createElement('input')
            let ingredientAmount = document.createElement('input')
            let addNewIngredientButton = document.createElement('button')
            ingredientTitle.classList.add('new-ingredient-title')
            ingredientAmount.classList.add('new-ingredient-amount')
            addNewIngredientButton.classList.add('add-new-ingredient-button')
            addNewIngredientButton.textContent = 'Add New Ingredient'
            ingredientTitle.setAttribute('type', 'text')
            ingredientTitle.setAttribute('placeholder', 'Ingredient Name')
            ingredientAmount.setAttribute('type', 'number')
            ingredientAmount.setAttribute('placeholder', '5')

            ingredientListDiv.appendChild(ingredientTitle)
            ingredientListDiv.appendChild(ingredientAmount)
            ingredientListDiv.appendChild(addNewIngredientButton)

            addNewIngredientButton.addEventListener('click', event => {
                const id = event.target.parentElement.parentElement.children[3].innerHTML
                console.log(id)
                console.log(event)
                let liListIngredient = event.target.parentElement.children[1]
                if (ingredientTitle.value && ingredientAmount.value) {
                    console.log(ingredientTitle.value, ingredientAmount.value)
                    fetch('http://localhost:3000/ingredients', {
                        method: 'POST',
                        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                        body: JSON.stringify({name: ingredientTitle.value, amount: ingredientAmount.value, recipeID: id})
                    })
                    .then(response => response.json())
                    .then(savedIngredient => {
                        console.log(savedIngredient)
                        let ingredient = {
                            title: savedIngredient.name,
                            amount: savedIngredient.amount,
                            recipeID: savedIngredient.recipeID,
                            ingredientID: savedIngredient._id
                        }
                        addNewIngredientToDOM(ingredient, liListIngredient)
                        // location.reload()
                    })
                }
            })
        })
    })
}
//end
function addNewIngredientToDOM(ingredient, liListIngredient) {
    let li = document.createElement('li');
    li.classList.add('edit-ingredient')
    let pIngTitle = document.createElement('p')
    pIngTitle.classList.add('edit-title-ingredient')
    pIngTitle.textContent = ingredient.title
    let fillerText = document.createElement('p')
    fillerText.textContent = ' - '
    let pIngAmount = document.createElement('p')
    pIngAmount.classList.add('edit-amount-ingredient')
    pIngAmount.textContent = ingredient.amount
    li.appendChild(pIngTitle)
    li.appendChild(fillerText)
    li.appendChild(pIngAmount)
    liListIngredient.appendChild(li)
    editRecipes(ingredient.ingredientID);
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

function editRecipes(newIngredientID) {
    // const recipeID = document.appendChild.querySelector('.hidden-recipe-id')
    const selectedRecipe = document.querySelectorAll('.editable')
    console.log(selectedRecipe)
    selectedRecipe.forEach(recipeField => {
        recipeField.contentEditable = true;
        recipeField.addEventListener('blur', (event) => {
            let fieldText = event.target.innerHTML
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
                if (fieldText.length === 0) {fieldText = 'Click to edit me'}
                const id = event.target.parentElement.parentElement.children[3].innerHTML
                fetch('http://localhost:3000/recipes/title', {
                    method: 'PATCH',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({_id: id, title: fieldText})
                }).then(console.log('Fetch Successful'))
            } else if (event.target === indexOfRating) {
                if (fieldText.length === 0) {fieldText = 'Click to edit me'}
                const id = event.target.parentElement.parentElement.parentElement.children[3].innerHTML
                let ratingNumber = +fieldText
                //TODO: Fix this so that the user can only edit the number. It will probably be in the createRecipe function
                fetch('http://localhost:3000/recipes/rating', {
                    method: 'PATCH',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({_id: id, rating: ratingNumber})
                }).then(console.log('Fetch Successful'))
            }
            
        })
    })
    const descriptions = document.querySelectorAll('.description');
    descriptions.forEach(description => {
        description.contentEditable = true;
        description.addEventListener('blur', (event) => {
            console.log(event)
            let descriptionText = event.target.innerHTML
            const id = event.target.parentElement.children[3].innerHTML;
            console.log(id, descriptionText)
            if (descriptionText.length === 0) {descriptionText = 'Click to edit me'}
            fetch('http://localhost:3000/recipes/directions', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: id, description: descriptionText})
            }).then(console.log('Fetch Successful'))
        })
    })
    // const ingredientID = document.querySelector('.p-ingredient-id')

    const titleIngredients = document.querySelectorAll('.edit-title-ingredient');
    titleIngredients.forEach(titleIngredient => {
        titleIngredient.contentEditable = true;
        titleIngredient.addEventListener('blur', (event) => {
            console.log(event);
            let ingredientID;
            if (newIngredientID) {
                ingredientID = newIngredientID
            } else {
                ingredientID = event.target.parentElement.children[3].innerHTML
            }
            const ingredientTitleText = event.target.innerHTML
            if (ingredientTitleText.length === 0) {ingredientTitleText = 'Click to edit me'}
            fetch('http://localhost:3000/ingredients/name', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: ingredientID, name: ingredientTitleText})
            }).then(console.log('Fetch Successful'))
        })
    })
    const amountIngredient = document.querySelectorAll('.edit-amount-ingredient');
    amountIngredient.forEach(amountIngredient => {
        amountIngredient.contentEditable = true;
        amountIngredient.addEventListener('blur', (event) => {
            console.log(event);
            let ingredientID;
            if (newIngredientID) {
                ingredientID = newIngredientID
            } else {
                ingredientID = event.target.parentElement.children[3].innerHTML
            }
            let ingredientAmountNumber = event.target.innerHTML
            if (parseInt(ingredientAmountNumber) < 0 || ingredientAmountNumber.length === 0) {
                ingredientAmountNumber = 0;
            }
            fetch('http://localhost:3000/ingredients/amount', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: ingredientID, amount: +ingredientAmountNumber})
            }).then(console.log('Fetch Successful'))
        })
    })
}
//end

function changeCategorySelect() {
    const categorySelectAll = document.querySelectorAll('.category-select')
    categorySelectAll.forEach(categorySelect => {
        categorySelect.addEventListener('change', event => {
            console.log(event)
            let category = event.target.value
            let id = event.target.parentElement.parentElement.parentElement.children[3].innerHTML
            fetch('http://localhost:3000/recipes/category', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: id, category: category})
            })
        })
    })
}

async function sendToShoppingListSelect() {
    const response = await fetch('http://localhost:3000/shopping', {
        method: 'GET',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
    })
    const shoppingResponse = response.json();
    shoppingResponse.then(shoppingLists => {
        console.log(shoppingLists)
        const shoppingSelectAll = document.querySelectorAll('.recipe-shopping-select')
        shoppingSelectAll.forEach(shoppingSelect => {
            shoppingLists.forEach(list => {
                let option = document.createElement('option')
                option.textContent = list.title
                option.setAttribute('data-id', list._id)
                shoppingSelect.appendChild(option)
            })
        })
        const shoppingButtonAll = document.querySelectorAll('.recipe-shopping-button')
        shoppingButtonAll.forEach(shoppingButton => {
            shoppingButton.addEventListener('click', event => {
                console.log(event)
                let value = event.target.parentElement.children[0].value
                console.log(value)

                let valueOfOneIngredient = event.target.parentElement.parentElement.children[2].children[1].children[0].children[0].innerHTML
                console.log(valueOfOneIngredient)

                let shoppingListOptions = Array.from(event.target.parentElement.children[0].children)
                console.log(shoppingListOptions)
                let shoppingListId = '';
                shoppingListOptions.forEach(option => {
                    if (option.value === value) {
                        shoppingListId = option.getAttribute('data-id')
                    }
                })
                console.log(shoppingListId)

                let ingredientsLiArray = Array.from(event.target.parentElement.parentElement.children[2].children[1].children)
                console.log(ingredientsLiArray)
                ingredientsLiArray.forEach(ingLI => {
                    let name = ingLI.children[0].innerHTML
                    let amount = ingLI.children[2].innerHTML
                    fetch('http://localhost:3000/ingredientShopping', {
                        method: 'POST',
                        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                        body: JSON.stringify({name: name, amount: +amount, shoppingListID: shoppingListId})
                    }).then(console.log('success'))
                })
            })
        })
    })
}

function deleteIngredient() {
    const editIngredientAll = document.querySelectorAll('.edit-ingredient')
    editIngredientAll.forEach(editIngredient => {
        editIngredient.addEventListener('mouseover', event => {
            event.target.children[4].removeAttribute('hidden')
        })
    })
    editIngredientAll.forEach(editIngredient => {
        editIngredient.addEventListener('mouseleave', event => {
            event.target.children[4].setAttribute('hidden', '')
        })
    })
    const deleteIngredientButtonAll = document.querySelectorAll('.delete-ingredient-button');
    deleteIngredientButtonAll.forEach(deleteIngredientButton => {
        deleteIngredientButton.addEventListener('click', event => {
            console.log(event)
            let id = event.target.parentElement.children[3].innerHTML
            let parentElement = event.target.parentElement.parentElement
            let childElement = event.target.parentElement
            parentElement.removeChild(childElement)
            fetch('http://localhost:3000/ingredients/delete', {
                method: 'DELETE',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({_id: id})
            }).then(console.log('Fetch Successful'))
        })
    })
}


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
        editRecipes('')
        addNewIngredient(recipesWithIngredients)
        changeCategorySelect()
        deleteIngredient()
        sendToShoppingListSelect()
        
    }
    
    //Called when allRecipes category is clicked:
    if (!categoryName) {
        recipesWithIngredients.forEach(recipe => {
            createRecipe(recipe)
        })
        editRecipes('')
        addNewIngredient(recipesWithIngredients)
        changeCategorySelect()
        deleteIngredient()
        // sendToShoppingListSelect()
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

    let categorySelectDiv = document.createElement('div')
    let categorySelect = document.createElement('select')
    categorySelect.classList.add('category-select')
    let categories = globalDBCategory
    categories.forEach(category => {
        let option = document.createElement('option')
        option.textContent = category
        categorySelect.appendChild(option)
    })
    categorySelect.value = recipe.category
    categorySelectDiv.appendChild(categorySelect);

    let ratingDiv = document.createElement('div')
    ratingDiv.classList.add('rating-div')

    let ratingFillerText = document.createElement('p');
    ratingFillerText.textContent = 'Rating: '
    let ratingEndFillerText = document.createElement('p')
    ratingEndFillerText.textContent = '/5'

    let pRatingNumber = document.createElement('p');
    pRatingNumber.classList.add('editable')
    if (recipe.rating === null || recipe.rating > 5 || recipe.rating < 0) {
        pRatingNumber.textContent = 0
    } else {
        pRatingNumber.textContent = recipe.rating
    }
    

    ratingDiv.appendChild(ratingFillerText)
    ratingDiv.appendChild(pRatingNumber);
    ratingDiv.appendChild(ratingEndFillerText)
    recipeHeaderDiv.appendChild(h2);
    recipeHeaderDiv.appendChild(categorySelectDiv) //ADD THE SELECT DIV HERE
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

        let deleteIngredientButton = document.createElement('button')
        deleteIngredientButton.textContent = 'X';
        deleteIngredientButton.classList.add('delete-ingredient-button')
        deleteIngredientButton.setAttribute('hidden', '');

        liIngredient.appendChild(pTitleIngredient)
        liIngredient.appendChild(fillerText)
        liIngredient.appendChild(pAmountIngredient)
        liIngredient.appendChild(pIngredientId)
        liIngredient.appendChild(deleteIngredientButton)
        liListIngredientDiv.appendChild(liIngredient);
    })
    let showIngredientButton = document.createElement('button')
    showIngredientButton.classList.add('show-ingredient-button')
    showIngredientButton.textContent = 'Add Ingredient'
    
    ingredientListDiv.appendChild(ingredientH3)
    ingredientListDiv.appendChild(liListIngredientDiv)
    ingredientListDiv.appendChild(showIngredientButton)
    recipeDiv.appendChild(ingredientListDiv)

    //hidden ID for Recipe
    let hiddenId = document.createElement('p')
    hiddenId.classList.add('hidden-recipe-id')
    hiddenId.setAttribute('hidden', '')
    hiddenId.innerHTML = recipe._id
    recipeDiv.appendChild(hiddenId)   

    //send to shoppingList:
    let shoppingDiv = document.createElement('div')
    shoppingDiv.classList.add('recipe-shopping-div')
    let shoppingButton = document.createElement('button')
    shoppingButton.classList.add('recipe-shopping-button')
    shoppingButton.textContent = 'Send Ingredients to Shopping List'
    let shoppingSelect = document.createElement('select')
    shoppingSelect.classList.add('recipe-shopping-select')
    shoppingDiv.appendChild(shoppingSelect)
    shoppingDiv.appendChild(shoppingButton)
    recipeDiv.appendChild(shoppingDiv)
    
    //last append to main div
    recipeListDiv.appendChild(recipeDiv)
    
}