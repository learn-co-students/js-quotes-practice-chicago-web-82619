let allQuotes = []
let totalQuotes = []
const quoteList = document.querySelector('#quote-list')
const URL = 'http://localhost:3000/quotes?_embed=likes'

// make a quote patch

function handlePatch(event) {
  console.log(event.target.parentNode.parentNode.parentNode.id)
  const id = event.target.parentNode.parentNode.parentNode.id
  const quote = event.target.parentNode.children[1].value
  const author = event.target.parentNode.children[2].value
  const reqObj = {
    method: 'PATCH',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({
      quote: quote,
      author: author
    })
  }
  fetch(`http:localhost:3000/quotes/${id}`, reqObj)
    .then(resp => resp.json())
    .then(quoteData => {
      updateQuoteBlock(quoteData)
    })
}

function updateQuoteBlock(quoteData) {
  const quoteBlock = document.getElementById(`${quoteData.id}`)

  console.log(quoteBlock.children[0].children)
  const p = quoteBlock.children[0].children[0]
  p.innerText = ""
  p.innerText = quoteData.quote
  const foot = quoteBlock.children[0].children[1]
  foot.innerText = ""
  foot.innerText = quoteData.author
  // eForm.style.visibility =s "hidden";
  console.log(quoteBlock.children[0].lastElementChild)
  const form = quoteBlock.children[0].lastElementChild
  form.style.visibility = "hidden";


}


// get all quotes
function getQuotes() {
  fetch(URL)
    .then(resp => resp.json())
    .then(quotesData => {
      quoteList.innerHTML = ""
      allQuotes = quotesData
      quoteList.innerHTML = handleQuotes(allQuotes)
      const eForm = document.getElementsByClassName("edit-form");
      // console.log(eForm)
      const eFormArr = Array.from(eForm)
      eFormArr.forEach((form) => {
        // console.log(form);
        form.style.visibility = 'hidden';
      });
    })
}

function handleQuotes(allQuotes) {
  return allQuotes.map(renderQuote).join('');
}

function renderQuote(quote){
  let addedQuote = []

  let quoteLikes = 0

  if (quote.likes) {
    quoteLikes = quote.likes.length
  }

  const quoteLiBegin = (`
  <li class='quote-card' id="${quote.id}">
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id="${quote.id}">Likes: <span>${quoteLikes}</span></button>
      <button class='btn-danger'>Delete</button>
      <button id='edit'>Edit</button>
`)

  // console.log('quote li', quoteLi)
  const quoteLiMid = (`
    <form class="edit-form" id="edit-form-${quote.id}">
      <label>Edit Form</label>
      <input type="text" name="quote" value="${quote.quote}">
      <input type="text" name="author" value="${quote.author}">
      <input type="submit" class="edit-button">
    </form>`)

  const quoteLiEnd = (`
    </blockquote>
  </li>`)

  return addedQuote = quoteLiBegin + quoteLiMid + quoteLiEnd
  console.log('addedQuote', addedQuote)

}

// Edit Quote
//
// function editQuote(quote) {
//   // console.log('edit quote id', quote.id)
//   let form = []
//
//   return fetch(`http://localhost:3000/quotes/${quote.id}`)
//     .then(resp => resp.json())
//     .then(quoteData => {
//       // console.log(quoteData)
//       form = (`
//         <form data-id="#{quote.id}">
//           <label>Edit Form</label>
//           <input type="text" name="quote" value="${quote.quote}">
//           <input type="text" name="author" value="${quote.author}">
//           <input type="submit">
//         </form>`)
//         // console.log(form)
//     })
//   // console.log(form)
//     // editForm.style.visibility = "hidden"
//   // quoteLi.style.display="none";
//
//   // populate with old data
//
//   // submit form
//
//   // hide and clear form
//
//   // fetch with patch
//
//   // dynamically update that li
//
//   // addForm(event)
// }



// add new quote

function addQuote(event) {
  const newQuote = document.getElementById('new-quote')
  const newAuthor = document.getElementById('author')
  const reqObj = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      quote: newQuote.value,
      author: newAuthor.value
    })
  }
  fetch('http://localhost:3000/quotes', reqObj)
    .then(resp => resp.json())
    .then(quoteData => {
      quoteList.insertAdjacentHTML('beforeend', renderQuote(quoteData));
    })
}

// add like button
function addLike(event) {
  const authorId = event.target.parentNode.parentNode.id
  // console.log(authorId)
  // console.log(event.target.parentNode.parentNode.id)
  const reqObj = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      quoteId: parseInt(authorId)
    })
  }

  fetch('http://localhost:3000/likes', reqObj)
    .then(resp => resp.json())
    .then(likeData => {

      // console.log(likeData)

      getQuoteLikes(likeData)
      // console.log(foundNumLikes)


      // const button = document.getElementById(`dataset-id="${likeData.quoteId}"`)
      // button.innerHTML = ""
      // console.log(button)
      // quoteList.insertAdjacentHTML('beforeend', renderQuote(quoteData));
    })

}

function getQuoteLikes (likeData) {
  fetch(URL)
    .then(resp => resp.json())
    .then(quotesData => {
      const foundNumLikes = mapQuotes(quotesData, likeData)
      // console.log(foundNumLikes)
      // console.log(likeData.quoteId)
      const buttons = document.querySelectorAll(`[data-id]`);
      const buttonsArr = Array.from(buttons)

      const quote = buttonsArr.filter((button) => {
        return button.dataset.id === `${likeData.quoteId}`
      })
      quote[0].innerHTML = ""
      quote[0].innerHTML = `Likes: <span>${foundNumLikes}</span>`


    })
  }

  function mapQuotes(quotes, likeData) {
    const foundQuote = quotes.find(quote => quote.id === likeData.quoteId)
    const numLikes = foundQuote.likes.length
    return numLikes
  }

  // handle Delete

  function handleDelete(event) {
    // console.log(event.target.parentNode.parentNode.id)
      const reqObj = {
        method: 'DELETE'
      }
      const quoteId = event.target.parentNode.parentNode.id
      // console.log(target.parentNode)
      fetch(`http://localhost:3000/quotes/${quoteId}`, reqObj)
        .then(resp => resp.json() )
        .then(data => {
          console.log('deleted', data)
          // console.log(target)
          event.target.parentNode.parentNode.remove()
        })

  }
