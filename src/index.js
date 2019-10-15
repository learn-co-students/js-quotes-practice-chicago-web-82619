// set main function to control app behavior
function main() {
    // only run JS after the page has loaded
    document.addEventListener("DOMContentLoaded", () => {
        //call function to display quotes
        displayQuotes();
        // call function for creating new quote
        addQuoteListener();
        // call function for adding new likes
        addLikeListener();
    });
}
//=========================
// DISPLAY QUOTES
//=========================

// extract JSON data using fetch and display quotes by calling method to create and insert HTML
function displayQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(json => renderQuotes(json))
}

// insert HTML into document for each quote instance 
function renderQuotes(quotes) {
    const ul = document.querySelector('#quote-list')
    quotes.forEach(el => {
        ul.insertAdjacentHTML('beforeend', 
        `
        <li class='quote-card' data-quote-id='${el['id']}'>
            <blockquote class="blockquote">
                <p class="mb-0">${el['quote']}</p>
                <footer class="blockquote-footer">${el['author']}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${el['likes'].length}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>
        `)
    });
}

//=============================
// ADD NEW QUOTE
//=============================

// add click listener for new quote button
function addQuoteListener() {
    document.addEventListener('click', (event) => {
        event.preventDefault();
        if(event.target.id === 'create-btn'){
            createQuote();
        }
    });
}

// save a quote to the db 
function createQuote() {
    const form = document.querySelector('#new-quote-form')
    const configObj = {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "quote": form[0].value,
            "author": form[1].value
        })
    }
    fetch('http://localhost:3000/quotes', configObj)
    .then(resp => resp.json())
    .then(json => renderNewQuote(json))

    form[0].value = ""
    form[1].value = ""

}

// create a li and insert to the ul with the form data
function renderNewQuote(json) {
    const ul = document.querySelector('#quote-list')
    ul.insertAdjacentHTML('beforeend', 
    `
    <li class='quote-card' data-quote-id='${json['id']}'>
        <blockquote class="blockquote">
            <p class="mb-0">${json['quote']}</p>
            <footer class="blockquote-footer">${json['author']}</footer>
            <br>
            <button class='btn-success'>Likes: <span>0</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
    </li>
    `);
}

//==========================
// ADD LIKE
//==========================

// add event listener to add likes to a quote
function addLikeListener() {
    document.addEventListener('click', (event) => {
        if(event.target.className === "btn-success") {
            createLike(event.target);
        } else if(event.target.className === "btn-danger") {
            deleteQuote(event.target)
        }
    });
}

function createLike(target) {
    const id = parseInt(target.parentNode.parentNode.dataset.quoteId);
    const configObj = {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "quoteId": id
        })
    }
    fetch('http://localhost:3000/likes', configObj)
    .then(resp => resp.json())
    .then(json => {
        const span = target.querySelector('span')
        span.innerHTML = parseInt(span.innerHTML) + 1
    })
}

function deleteQuote(target) {
    const deleteObj = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": target.parentNode.parentNode.dataset.quoteId })
    }
    fetch(`http://localhost:3000/quotes/${target.parentNode.parentNode.dataset.quoteId}`, deleteObj)
    removeQuote(target)
}


function removeQuote(target) {
    const ul = document.querySelector("#quote-list")
    ul.removeChild(target.parentNode.parentNode)
}

main();