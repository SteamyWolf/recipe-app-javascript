const categoriesList = document.querySelector('.categories-list');
const ulOfCategories = document.querySelector('.li-list-category');

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
    displayCategories(recipes)
    let combined = recipes.map(recipe => {
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
    console.log(combined)
})

function displayCategories(recipes) {
    let finalCategories = [];
    let categories = new Set(recipes.map(recipe => recipe.category))
    console.log(categories)
    categories.forEach(category => {
        ulOfCategories.appendChild(createCategory(category))
    })
}
function createCategory(category) {
    let li = document.createElement('li')
    li.textContent = category
    return li
}