function main() {
  document.addEventListener("DOMContentLoaded", function() {
    getQuotes();
    addFormListener();
  })

  function getQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(resp => resp.json())
      .then(dataSet => renderQuotes(dataSet))
  }

  function renderQuotes(dataSet){
    const qoutesContainer = document.getElementById("quote-list");
    qoutesContainer.innerHTML ='';
    dataSet.forEach(data => renderQuote(data))
  }

  function renderQuote(data) {
    const qoutesContainer = document.getElementById("quote-list");
    const newLi = document.createElement('li');
    newLi.setAttribute('class', 'quote-card');
    const blockquote = document.createElement('blockquote');
    blockquote.setAttribute('class', 'blockquote');
    const p = document.createElement('p');
    p.setAttribute('class', 'mb-0');
    const footer = document.createElement('footer');
    footer.setAttribute('class', 'blockquote-footer');
    const likeButton = document.createElement('button');
    likeButton.setAttribute('class', 'btn-success');
    const span = document.createElement('span');
    likeButton.innerHTML = `Likes: `;
    likeButton.append(span)
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'btn-danger');
    deleteButton.innerHTML = 'Delete'

    likeButton.onclick = (event) => likeQuote(event, data);
    deleteButton.onclick = (event) => deleteQuote(event, data);

    p.innerText = data.quote;
    footer.innerText = data.author;
    span.innerHTML = data.likes ? data.likes.length : 0;
    blockquote.append(p, footer, likeButton, deleteButton);
    newLi.append(blockquote);
    qoutesContainer.append(newLi);
    
  }

  function likeQuote(event, data) {
    
    const reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quoteId: data.id,
        createdAt: Math.floor(Date.now() / 1000)
      })
    }
    fetch("http://localhost:3000/likes", reqObj)
    
    event.target.firstElementChild.innerHTML = parseInt(event.target.firstElementChild.innerHTML) + 1;
    
    }
   
  function deleteQuote(event, data) {
    const reqObj = {
      method: "DELETE"
    };

    fetch(`http://localhost:3000/quotes/${data.id}`, reqObj)
      .then(resp => resp.json())
      .then(data => {
        event.target.parentNode.parentNode.remove();
      });
  }

  function addFormListener() {
    formElement = document.getElementById('new-quote-form');
    formElement.onsubmit = (event) => {
      event.preventDefault();
      const formData = getFormData(event);
      postQuote(formData);
      formElement.reset()
    }
  }

  function getFormData(event) {
    const quote = event.target[0].value
    const author = event.target[1].value
    
    return {
      quote,
      author
    }
  }

  function postQuote(formData) {
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers:{
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(data => renderQuote(data));
  }
}

main()