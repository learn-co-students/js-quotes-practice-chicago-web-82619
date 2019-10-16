// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', () => {

  console.log('chicken man')

  getQuotes()

  // const eForms = document.getElementsByClassName('edit-form')
  // console.log(eForms)

  document.addEventListener('click', (event) => {
    event.preventDefault()
    // console.log(event.target)
    if (event.target.className === 'btn-success') {
      // console.log('success')
      addLike(event)
    } else if (event.target.className === 'btn-danger') {
      handleDelete(event)
    } else if (event.target.className === 'btn btn-primary') {
      addQuote(event)
    } else if (event.target.id === 'edit') {
      //
      const id = event.target.parentNode.parentNode.id
      const eForm = document.getElementById(`edit-form-${id}`)
      // console.log(eForm.style.visibility)
        if (eForm.style.visibility === "hidden") {
          eForm.style.visibility = "visible";
        } else {
          eForm.style.visibility = "hidden";
        }
    } else if (event.target.className === 'edit-button') {
      handlePatch(event)
    }
  })

})
