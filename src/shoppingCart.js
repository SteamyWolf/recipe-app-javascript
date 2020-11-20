const addListButton = document.querySelector('.add-shopping-list-button')
const allShoppingLists = document.querySelector('.all-shopping-lists');

addListButton.addEventListener('click', addShoppingList);

function addShoppingList() {
    let shoppingListDiv = document.createElement('div')
    shoppingListDiv.classList.add('shopping-list')
    let shoppingList = `
        <h3 class="shopping-title" contentEditable=true>Click to edit title</h3>
        <button class="addIngredient">Add Ingredient</button>
    `;
    shoppingListDiv.innerHTML = shoppingList
    allShoppingLists.appendChild(shoppingListDiv)
}

async function getShoppingLists() {
    const response = await fetch('http://localhost:3000/shopping', {
        method: 'GET',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
    })
    const shoppingLists = response.json()
    return shoppingLists
} 

getShoppingLists().then(async shoppingLists => {
    console.log(shoppingLists)

    let shoppingListsWithIngredients = await shoppingLists.map(shoppingList => {
        fetch('http://localhost:3000/ingredientShopping', {
            method: 'GET',
            headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(ingredients => {
            shoppingList.ingredients.push(ingredients);
        })
        return shoppingList
    })
    console.log(shoppingListsWithIngredients)
    displayShoppingLists(shoppingListsWithIngredients)
})

function displayShoppingLists(shoppingListsWithIngredients) {
    shoppingListsWithIngredients.forEach(list => {
        let shoppingListDiv = document.createElement('div');
        shoppingListDiv.classList.add('shopping-list')
        let shoppingListHTMl = `
            <h3 class="shopping-list-title">${list.title}</h3>
                <ul>
                    ${list.ingredients.map(ingredient => `${ingredient.name} - ${ingredient.amount}`)}
                </ul>
            <button class="add-ingredient-button">Add Ingredient</button>
        `
        shoppingListDiv.innerHTML = shoppingListHTMl
        allShoppingLists.appendChild(shoppingListDiv)
    })
    
}