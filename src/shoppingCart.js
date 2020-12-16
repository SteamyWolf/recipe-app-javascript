const addListButton = document.querySelector('.add-shopping-list-button')
const allShoppingLists = document.querySelector('.all-shopping-lists');

addListButton.addEventListener('click', addShoppingList);

async function addShoppingList() {
    await fetch('https://recipe-app-wyatt.herokuapp.com/shopping', {
        method: 'POST',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Click Me to Edit Title' })
    }).then(response => response.json())
        .then(list => {
            console.log(list)
            // displayShoppingLists(list)
            // deleteShoppingList('new')
            recallLists('added-new')
        })
}

async function getShoppingLists() {
    const response = await fetch('https://recipe-app-wyatt.herokuapp.com/shopping', {
        method: 'GET',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
    })
    const shoppingLists = response.json()
    return shoppingLists
}

function recallLists(command) {
    if (command === 'added-new') {
        while (allShoppingLists.firstChild) {
            allShoppingLists.removeChild(allShoppingLists.firstChild)
        }
    }
    getShoppingLists().then(async shoppingLists => {
        console.log(shoppingLists)
        let shoppingListsWithIngredients = await shoppingLists.map(async shoppingList => {
            await fetch(`https://recipe-app-wyatt.herokuapp.com/ingredientShopping/ingredientsByShoppingList/${shoppingList._id}`, {
                method: 'GET',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(ingredients => {
                    shoppingList.ingredients.push(ingredients);
                })
            return shoppingList
        })
        Promise.all(shoppingListsWithIngredients).then(values => {
            displayShoppingLists(values)
            addIngredient(values)
            deleteShoppingList('old')
        })
    })
}
recallLists('initialization')

function displayShoppingLists(shoppingListsWithIngredients) {
    //called upon initialization
    shoppingListsWithIngredients.forEach(list => {
        console.log(list)
        let shoppingListDiv = document.createElement('div');
        shoppingListDiv.classList.add('shopping-list')

        let h3 = document.createElement('h3')
        h3.classList.add('shopping-list-title')
        h3.textContent = list.title
        h3.contentEditable = true;
        h3.addEventListener('blur', event => {
            fetch('https://recipe-app-wyatt.herokuapp.com/shopping/title', {
                method: 'PATCH',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: list._id, title: event.target.innerHTML })
            })
        })
        let ul = document.createElement('ul')
        ul.classList.add('shopping-list-ingredient-list')
        let button = document.createElement('button')
        button.classList.add('add-ingredient-button')
        button.textContent = 'Add Ingredient'
        let pHidden = document.createElement('p')
        pHidden.setAttribute('hidden', '')
        pHidden.textContent = list._id

        if (list.ingredients[0] !== undefined) {
            list.ingredients[0].forEach(ingredient => {
                let listIngredient = document.createElement('li')
                listIngredient.classList.add('list-ingredient-element')
                let pTitle = document.createElement('p')
                pTitle.textContent = ingredient.name
                let dashText = document.createElement('p')
                dashText.classList.add('dash-text')
                dashText.textContent = ' - '
                let pAmount = document.createElement('p')
                pAmount.textContent = ingredient.amount
                pAmount.contentEditable = true;
                pAmount.addEventListener('blur', event => {
                    console.log(event)
                    fetch('https://recipe-app-wyatt.herokuapp.com/ingredientShopping/amount', {
                        method: 'PATCH',
                        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                        body: JSON.stringify({ _id: ingredient._id, amount: +event.target.innerHTML })
                    })
                })
                if (ingredient.complete === true) {
                    pTitle.style.textDecoration = 'line-through'
                    pAmount.style.textDecoration = 'line-through'
                }

                let completeButton = document.createElement('button')
                completeButton.classList.add('complete-button')
                completeButton.textContent = 'Complete'
                completeButton.setAttribute('hidden', '')
                completeButton.addEventListener('click', event => {
                    pTitle.style.textDecoration = 'line-through'
                    pAmount.style.textDecoration = 'line-through'
                    fetch('https://recipe-app-wyatt.herokuapp.com/ingredientShopping/complete', {
                        method: 'PATCH',
                        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                        body: JSON.stringify({ _id: ingredient._id, complete: true })
                    })
                })
                let deleteButton = document.createElement('button')
                deleteButton.classList.add('delete-ingredient-from-shopping-list')
                deleteButton.textContent = 'X'
                deleteButton.setAttribute('hidden', '')

                listIngredient.addEventListener('mouseleave', event => {
                    completeButton.setAttribute('hidden', '')
                    deleteButton.setAttribute('hidden', '')
                })
                listIngredient.addEventListener('mouseenter', event => {
                    completeButton.removeAttribute('hidden')
                    deleteButton.removeAttribute('hidden')
                })
                deleteButton.addEventListener('click', event => {
                    console.log(event)
                    ul.removeChild(event.target.parentElement)
                    fetch('https://recipe-app-wyatt.herokuapp.com/ingredientShopping/delete', {
                        method: 'DELETE',
                        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                        body: JSON.stringify({ _id: ingredient._id })
                    }).then(console.log('deletion success'))
                })

                listIngredient.appendChild(pTitle)
                listIngredient.appendChild(dashText)
                listIngredient.appendChild(pAmount)
                listIngredient.appendChild(completeButton)
                listIngredient.appendChild(deleteButton)
                ul.appendChild(listIngredient)
            })
        }
        shoppingListDiv.appendChild(h3)
        shoppingListDiv.appendChild(ul)
        shoppingListDiv.appendChild(button)
        shoppingListDiv.appendChild(pHidden)
        allShoppingLists.appendChild(shoppingListDiv)
    })
}

function addIngredient(shoppingListsWithIngredients) {
    let allAddIngBtn = document.querySelectorAll('.add-ingredient-button');
    if (shoppingListsWithIngredients === 'added-new-list') {
        allAddIngBtn = document.querySelectorAll('.second-add-ingredient-button')
    }
    console.log(allAddIngBtn)
    allAddIngBtn.forEach(ingBtn => {
        ingBtn.addEventListener('click', event => {
            console.log(event)
            event.target.setAttribute('hidden', '')
            let titleInput = document.createElement('input')
            titleInput.setAttribute('type', 'text')
            let amountInput = document.createElement('input')
            amountInput.setAttribute('type', 'number')
            let addButton = document.createElement('button')
            addButton.classList.add('add-ingredient-button-real')
            addButton.textContent = 'Add'
            addButton.addEventListener('click', event => {
                let shoppingDiv = event.target.parentElement.children[1]
                let li = document.createElement('li')
                li.classList.add('list-ingredient-element')
                li.textContent = `${titleInput.value} - ${amountInput.value}`
                shoppingDiv.appendChild(li)
                let id = event.target.parentElement.children[3].innerHTML
                console.log(id)

                fetch('https://recipe-app-wyatt.herokuapp.com/ingredientShopping', {
                    method: 'POST',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: titleInput.value, amount: +amountInput.value, shoppingListID: id })
                }).then(response => response.json())
                    .then(addedIngredient => {
                        console.log(addedIngredient)
                        titleInput.value = '';
                        amountInput.value = '';
                        let listIngredient = [...event.target.parentElement.children[1].children]
                        console.log(listIngredient)
                        
                        // let listOfIngredients = event.target.parentElement.children[1].children
                        // console.log(listOfIngredients)
                        let lastChildOfListIngredient = listIngredient[listIngredient.length - 1]
                        console.log(lastChildOfListIngredient)

                            let completeButton = document.createElement('button')
                            completeButton.classList.add('complete-button')
                            completeButton.textContent = 'Complete'
                            completeButton.setAttribute('hidden', '')
                            completeButton.addEventListener('click', event => {
                                console.log(event)
                                titleInput.style.textDecoration = 'line-through'
                                amountInput.style.textDecoration = 'line-through'
                                fetch('https://recipe-app-wyatt.herokuapp.com/ingredientShopping/complete', {
                                    method: 'PATCH',
                                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ _id: addedIngredient._id, complete: true })
                                })
                            })

                            
                            let deleteButton = document.createElement('button')
                            deleteButton.classList.add('new-list-delete-button')
                            deleteButton.textContent = 'X'
                            deleteButton.setAttribute('hidden', '')

                            
                            lastChildOfListIngredient.appendChild(completeButton)
                            lastChildOfListIngredient.appendChild(deleteButton)
                            

                            lastChildOfListIngredient.addEventListener('mouseleave', event => {
                                completeButton.setAttribute('hidden', '')
                                deleteButton.setAttribute('hidden', '')
                                console.log('inside mouseleave')
                            })
                            lastChildOfListIngredient.addEventListener('mouseenter', event => {
                                completeButton.removeAttribute('hidden')
                                deleteButton.removeAttribute('hidden')
                            })
                            deleteButton.addEventListener('click', event => {
                                console.log(event)
                                let ul = event.target.parentElement.parentElement
                                ul.removeChild(event.target.parentElement)
                                fetch('https://recipe-app-wyatt.herokuapp.com/ingredientShopping/delete', {
                                    method: 'DELETE',
                                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ _id: addedIngredient._id })
                                }).then(console.log('deletion success'))
                            })
                    })
            })
            let shoppingListDiv = event.target.parentElement
            shoppingListDiv.appendChild(titleInput)
            shoppingListDiv.appendChild(amountInput)
            shoppingListDiv.appendChild(addButton)
        })
    })
}

function deleteShoppingList(age) {
    let shoppingListAll;
    if (age === 'old') {
        shoppingListAll = document.querySelectorAll('.shopping-list')
    }
    if (age === 'new') {
        shoppingListAll = document.querySelectorAll('.shopping-list-new')
    }
    shoppingListAll.forEach(shoppingList => {
        let hoverButton = document.createElement('button')
        hoverButton.textContent = 'Delete Shopping List'
        hoverButton.classList.add('hover-delete-button')
        hoverButton.setAttribute('hidden', '');
        hoverButton.addEventListener('click', event => {
            let id = event.target.parentElement.children[3].innerHTML
            event.target.parentElement.parentElement.removeChild(event.target.parentElement)
            fetch('https://recipe-app-wyatt.herokuapp.com/shopping/delete', {
                method: 'DELETE',
                headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id })
            }).then(console.log('deletion success'))
        })
        shoppingList.appendChild(hoverButton)
        shoppingList.addEventListener('mouseenter', event => {
            // event.target.parentElement.removeChild(event.target) //will remove... works!
            hoverButton.removeAttribute('hidden')
        })
        shoppingList.addEventListener('mouseleave', event => {
            hoverButton.setAttribute('hidden', '')
        })
    })
}