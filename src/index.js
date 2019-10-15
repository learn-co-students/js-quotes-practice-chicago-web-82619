// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const main = () => {
    document.addEventListener('DOMContentLoaded', (event) => {
        displayQuotes();
        addFormListener();
        addClickListener();
    })
    
}

const addClickListener = () => {
    document.addEventListener("click", (event) => {
        if (event.target.className === "btn-success"){
            addLikeToQuote(event.target);
        }
        else if (event.target.className === 'btn-danger'){
            deleteQuote(event.target);
        }
    })
}

const addLikeToQuote = (target) => {
    const id = parseInt(target.parentNode.parentNode.dataset.quoteId)
    const ul = document.getElementById("quote-list");
    
    const span = target.querySelector("span")

    fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "quoteId": id
        })
    }).then(resp => resp.json()).then(json => console.log(json))
    span.innerHTML = parseInt(span.innerHTML) + 1
}

const deleteQuote = (target) => {
    const id = target.parentNode.parentNode.dataset.quoteId
    const ul = document.getElementById("quote-list");

    const li = target.parentNode.parentNode

    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    })

    ul.removeChild(li);

}

const displayQuotes = () => {
    const ul = document.getElementById("quote-list");
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(json => json.forEach(el => ul.append(createQuote(el))));
}

const createQuote = (json) => {
    const li = document.createElement('li');
    li.dataset.quoteId = json.id
    li.className = 'quote-card';

    const blockquote = document.createElement('blockquote');
    blockquote.className = 'blockquote';

    const p = document.createElement('p');
    p.className = 'mb-0';
    p.innerHTML = json.quote;

    const footer = document.createElement('footer');
    footer.className = "blockquote-footer"
    footer.innerHTML = json.author;

    const btnSuccess = document.createElement('button');
    btnSuccess.className = 'btn-success';
    btnSuccess.innerHTML = "Likes: "

    const span = document.createElement('span');
    span.innerHTML = json['likes'].length;

    const btnDanger = document.createElement('button');
    btnDanger.className = 'btn-danger';
    btnDanger.innerHTML = "Delete";
    
    btnSuccess.append(span);
    blockquote.append(p, footer, btnSuccess, btnDanger);
    li.append(blockquote);
    return li;
}

const addFormListener = () => {
    const form = document.getElementById("new-quote-form")
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(event.target);
        addQuote(event.target);
    })
}

const addQuote = (target) => {
    const quote = document.getElementById("new-quote")
    const author = document.getElementById("author")

    const ul = document.getElementById("quote-list");

    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers:{
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            quote: quote.value,
            author: author.value
        })
    })
    .then(resp => resp.json())
    .then(json => ul.append(createQuote(json)));

    quote.value = " ";
    author.value = " ";
}


main();