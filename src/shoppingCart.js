const addListButton = document.querySelector('.add-shopping-list-button')
const allShoppingLists = document.querySelector('.all-shopping-lists');

addListButton.addEventListener('click', addShoppingList);

async function addShoppingList() {
    await fetch('http://localhost:3000/shopping', {
        method: 'POST',
        headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
        body: JSON.stringify({title: 'Click Me to Edit Title'})
    }).then(response => response.json())
    .then(list => {
        console.log(list)
        displayShoppingLists(list)
    })
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
    Promise.all(shoppingListsWithIngredients).then(values => {
        displayShoppingLists(values)
        addIngredient(values)
    })
})

function displayShoppingLists(shoppingListsWithIngredients) {
    if (Array.isArray(shoppingListsWithIngredients)) {
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
                fetch('http://localhost:3000/shopping/title', {
                    method: 'PATCH',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({_id: list._id, title: event.target.innerHTML})
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
                    let pTitle = document.createElement('p')
                    pTitle.textContent = ingredient.name
                    let dashText = document.createElement('p')
                    dashText.textContent = ' - '
                    let pAmount = document.createElement('p')
                    pAmount.textContent = ingredient.amount
                    pAmount.contentEditable = true;
                    pAmount.addEventListener('blur', event => {
                        console.log(event)
                        fetch('http://localhost:3000/ingredientShopping/amount', {
                            method: 'PATCH',
                            headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                            body: JSON.stringify({_id: ingredient._id, amount: +event.target.innerHTML})
                        })
                    })

                    if (ingredient.complete === true) {
                        pTitle.style.textDecoration = 'line-through'
                        pAmount.style.textDecoration = 'line-through'
                    }

                    let completeButton = document.createElement('button')
                    completeButton.textContent = 'Complete'
                    completeButton.setAttribute('hidden', '')
                    completeButton.addEventListener('click', event => {
                        pTitle.style.textDecoration = 'line-through'
                        pAmount.style.textDecoration = 'line-through'
                        fetch('http://localhost:3000/ingredientShopping/complete', {
                            method: 'PATCH',
                            headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                            body: JSON.stringify({_id: ingredient._id, complete: true})
                        })
                    })
                    let deleteButton = document.createElement('button')
                    deleteButton.textContent = 'Delete'
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
                        fetch('http://localhost:3000/ingredientShopping/delete', {
                            method: 'DELETE',
                            headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                            body: JSON.stringify({_id: ingredient._id})
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
    } else {
        //Create a new List trggers this code:
        // let shoppingListDiv = document.createElement('div');
        //     shoppingListDiv.classList.add('shopping-list')
    
        //     let h3 = document.createElement('h3')
        //     h3.classList.add('shopping-list-title')
        //     h3.textContent = shoppingListsWithIngredients.title
        //     h3.contentEditable = true;
        //     h3.addEventListener('blur', event => {
        //         fetch('http://localhost:3000/shopping/title', {
        //             method: 'PATCH',
        //             headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
        //             body: JSON.stringify({_id: shoppingListsWithIngredients._id, title: event.target.innerHTML})
        //         })
        //     })
        //     let ul = document.createElement('ul')
        //     ul.classList.add('shopping-list-ingredient-list')
        //     let button = document.createElement('button')
        //     button.classList.add('add-ingredient-button')
        //     button.textContent = 'Add Ingredient'
        //     let pHidden = document.createElement('p')
        //     pHidden.setAttribute('hidden', '')
        //     pHidden.textContent = shoppingListsWithIngredients._id
    
        //     shoppingListDiv.appendChild(h3)
        //     shoppingListDiv.appendChild(ul)
        //     shoppingListDiv.appendChild(button)
        //     shoppingListDiv.appendChild(pHidden)
        //     allShoppingLists.appendChild(shoppingListDiv)
        //     addIngredient(shoppingListsWithIngredients)
        let shoppingListDiv = document.createElement('div');
            shoppingListDiv.classList.add('shopping-list')
    
            let h3 = document.createElement('h3')
            h3.classList.add('shopping-list-title')
            h3.textContent = shoppingListsWithIngredients.title
            h3.contentEditable = true;
            h3.addEventListener('blur', event => {
                fetch('http://localhost:3000/shopping/title', {
                    method: 'PATCH',
                    headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                    body: JSON.stringify({_id: shoppingListsWithIngredients._id, title: event.target.innerHTML})
                })
            })
            let ul = document.createElement('ul')
            ul.classList.add('shopping-list-ingredient-list')
            let button = document.createElement('button')
            button.classList.add('add-ingredient-button')
            button.textContent = 'Add Ingredient'
            let pHidden = document.createElement('p')
            pHidden.setAttribute('hidden', '')
            pHidden.textContent = shoppingListsWithIngredients._id
    
            // if (shoppingListsWithIngredients.ingredients[0] !== undefined) {
            //     shoppingListsWithIngredients.ingredients[0].forEach(ingredient => {
            //         let listIngredient = document.createElement('li')
            //         let pTitle = document.createElement('p')
            //         pTitle.textContent = ingredient.name
            //         let dashText = document.createElement('p')
            //         dashText.textContent = ' - '
            //         let pAmount = document.createElement('p')
            //         pAmount.textContent = ingredient.amount
            //         pAmount.contentEditable = true;
            //         pAmount.addEventListener('blur', event => {
            //             console.log(event)
            //             fetch('http://localhost:3000/ingredientShopping/amount', {
            //                 method: 'PATCH',
            //                 headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
            //                 body: JSON.stringify({_id: ingredient._id, amount: +event.target.innerHTML})
            //             })
            //         })

            //         if (ingredient.complete === true) {
            //             pTitle.style.textDecoration = 'line-through'
            //             pAmount.style.textDecoration = 'line-through'
            //         }

            //         let completeButton = document.createElement('button')
            //         completeButton.textContent = 'Complete'
            //         completeButton.setAttribute('hidden', '')
            //         completeButton.addEventListener('click', event => {
            //             pTitle.style.textDecoration = 'line-through'
            //             pAmount.style.textDecoration = 'line-through'
            //             fetch('http://localhost:3000/ingredientShopping/complete', {
            //                 method: 'PATCH',
            //                 headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
            //                 body: JSON.stringify({_id: ingredient._id, complete: true})
            //             })
            //         })
            //         let deleteButton = document.createElement('button')
            //         deleteButton.textContent = 'Delete'
            //         deleteButton.setAttribute('hidden', '')

            //         listIngredient.addEventListener('mouseleave', event => {
            //             completeButton.setAttribute('hidden', '')
            //             deleteButton.setAttribute('hidden', '')
            //         })
            //         listIngredient.addEventListener('mouseenter', event => {
            //             completeButton.removeAttribute('hidden')
            //             deleteButton.removeAttribute('hidden')
            //         })
            //         deleteButton.addEventListener('click', event => {
            //             console.log(event)
            //             ul.removeChild(event.target.parentElement)
            //             fetch('http://localhost:3000/ingredientShopping/delete', {
            //                 method: 'DELETE',
            //                 headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
            //                 body: JSON.stringify({_id: ingredient._id})
            //             }).then(console.log('deletion success'))
            //         })
                    
            //         listIngredient.appendChild(pTitle)
            //         listIngredient.appendChild(dashText)
            //         listIngredient.appendChild(pAmount)
            //         listIngredient.appendChild(completeButton)
            //         listIngredient.appendChild(deleteButton)
            //         ul.appendChild(listIngredient)
            //     })
            // }
            shoppingListDiv.appendChild(h3)
            shoppingListDiv.appendChild(ul)
            shoppingListDiv.appendChild(button)
            shoppingListDiv.appendChild(pHidden)
            allShoppingLists.appendChild(shoppingListDiv)
        }
        addIngredient(shoppingListsWithIngredients)
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
                }).then(response => response.json())
                .then(addedIngredient => {
                    console.log(addedIngredient)
                    titleInput.value = '';
                    amountInput.value = '';

                    let listIngredient = [...event.target.parentElement.children[1].children]
                    console.log(listIngredient)
                    listIngredient.forEach(ingredientLI => {
                    console.log(ingredientLI)
                    let deleteButton = document.createElement('button')
                    deleteButton.textContent = 'Delete'
                    deleteButton.setAttribute('hidden', '')

                    if (!ingredientLI.innerHTML.includes(deleteButton.innerHTML)) {
                        ingredientLI.appendChild(deleteButton)
                    } 
                    
                    ingredientLI.addEventListener('mouseleave', event => {
                        // completeButton.setAttribute('hidden', '')
                        deleteButton.setAttribute('hidden', '')
                        console.log('inside mouseleave')
                    })
                    ingredientLI.addEventListener('mouseenter', event => {
                        // completeButton.removeAttribute('hidden')
                        deleteButton.removeAttribute('hidden')
                    })
                    deleteButton.addEventListener('click', event => {
                        console.log(event)
                        let ul = event.target.parentElement.parentElement
                        ul.removeChild(event.target.parentElement)
                        fetch('http://localhost:3000/ingredientShopping/delete', {
                            method: 'DELETE',
                            headers: { 'Access-Control-Allow-Orgin': 'Content-Type', 'Content-Type': 'application/json' },
                            body: JSON.stringify({_id: addedIngredient._id})
                        }).then(console.log('deletion success'))
                    })
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