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

    let shoppingListsWithIngredients = await shoppingLists.map(async shoppingList => {
        console.log(shoppingList)
        await fetch(`http://localhost:3000/ingredientShopping/ingredientsByShoppingList/${shoppingList._id}`, {
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
    Promise.all(shoppingListsWithIngredients).then(values => {
        console.log(JSON.stringify(values))
        displayShoppingLists(values)
        addIngredient(values)
    })
})

function displayShoppingLists(shoppingListsWithIngredients) {
    shoppingListsWithIngredients.forEach(list => {
        console.log(list)
        let shoppingListDiv = document.createElement('div');
        shoppingListDiv.classList.add('shopping-list')
        let shoppingListHTMl = `
            <h3 class="shopping-list-title">${list.title}</h3>
                <ul class="shopping-list-ingredient-list"></ul>
            <button class="add-ingredient-button">Add Ingredient</button>
            <p hidden>${list._id}</p>
        `
        shoppingListDiv.innerHTML = shoppingListHTMl
        allShoppingLists.appendChild(shoppingListDiv)
        let ulListIngredient = document.querySelector('.shopping-list-ingredient-list')
        console.log(JSON.stringify(list.ingredients))
        if (list.ingredients[0] !== undefined) {
            list.ingredients[0].forEach(ingredient => {
                console.log(ingredient)
                let listIngredient = document.createElement('li')
                listIngredient.textContent = `${ingredient.name} - ${ingredient.amount}`
                ulListIngredient.appendChild(listIngredient)
            })
        }
    })
    
}

function addIngredient(shoppingListsWithIngredients) {
    const allAddIngBtn = document.querySelectorAll('.add-ingredient-button');
    allAddIngBtn.forEach(ingBtn => {
        ingBtn.addEventListener('click', event => {
            console.log(event)
            event.target.setAttribute('hidden', '')
            let titleInput = document.createElement('input')
            titleInput.setAttribute('type', 'text')
            let amountInput = document.createElement('input')
            amountInput.setAttribute('type', 'number')
            let addButton = document.createElement('button')
            addButton.textContent = 'Add'
            addButton.addEventListener('click', event => {
                console.log(event)
                let shoppingDiv = event.target.parentElement.children[1]
                let li = document.createElement('li')
                li.textContent = `${titleInput.value} - ${amountInput.value}`
                shoppingDiv.appendChild(li)
                let id = event.target.parentElement.children[3].innerHTML
                console.log(id)
                fetch('http://localhost:3000/ingredientShopping', {
                    method: 'POST',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({name: titleInput.value, amount: +amountInput.value, shoppingListID: id})
                })
                titleInput.value = '';
                amountInput.value = '';
            })
            let shoppingListDiv = event.target.parentElement
            shoppingListDiv.appendChild(titleInput)
            shoppingListDiv.appendChild(amountInput)
            shoppingListDiv.appendChild(addButton)
        })
    })
}