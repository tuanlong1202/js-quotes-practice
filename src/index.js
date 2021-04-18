const quoteList = document.getElementById('quote-list');
const new_quote = document.getElementById('new-quote');
const author = document.getElementById('author');

const btnCancelEdit = document.getElementById('cancel-edit');

document.addEventListener('DOMContentLoaded', function(event){
    loadQuotes();
})

document.getElementById('new-quote-form').addEventListener('submit', function(event){
    event.preventDefault();
    if (dataIntegrity()) {
        let frmData = {
            quote:'',
            author:''
        };
        frmData.quote = new_quote.value;
        frmData.author = author.value;
        addNewQuote(frmData);    
    }
    return false;
})

function dataIntegrity() {
    if (new_quote.value == '' || !new_quote) {
        alert('Quote could not be empty!');
        new_quote.focus();
        return false;
    } else if (author.value == '' || !author) {
        alert('Author could not be empty!');
        author.focus();
        return false;
    }
    return true;
}

function loadQuotes() {
    removeAllChildNode(quoteList);
    let url = 'http://localhost:3000/quotes?_embed=likes';
    fetch(url)
        .then(response=>response.json())
        .then(function(result){
            if (btnSort.checked) {
                result.sort(GetSortOrder('author'));
            }
            result.forEach(element => {
               let blkQuote = blockquote();
               let qte = textNode(element.quote);
               let aut = textNode(element.author);
               
               let titleLike = textNode('Likes ');
               let numLike = textNode(element.likes.length);
               let txtDel = textNode('Delete');
               
               let qteFooter = footer();
               let pQuote = p();
               let pFooterLike = p();

               let spanNumLike = span();
               spanNumLike.appendChild(titleLike);
               spanNumLike.appendChild(numLike);
               spanNumLike.style.cursor = 'pointer';
               spanNumLike.addEventListener('click', function(event){
                   event.preventDefault();
                   addNewLike(element);
                   return false;
               })
               
               let spanDelete = span();
               spanDelete.appendChild(txtDel);
               spanDelete.style.cursor = 'pointer';
               spanDelete.addEventListener('click', function(event){
                   event.preventDefault();
                   deleteQuote(element);
                   return false;
               })

               let txtEdit = document.createTextNode(' Edit');
               let spanBtnEdit = span();
               spanBtnEdit.appendChild(txtEdit);
               spanBtnEdit.style.cursor = 'pointer';
               spanBtnEdit.addEventListener('click',function () {
                   showEditForm(element);
               });

               pFooterLike.appendChild(spanNumLike);
               pFooterLike.appendChild(br());
               pFooterLike.appendChild(spanDelete);
               pFooterLike.appendChild(spanBtnEdit);

               qteFooter.appendChild(aut);
               qteFooter.appendChild(br());
               qteFooter.appendChild(br());
               qteFooter.appendChild(br());
               qteFooter.appendChild(pFooterLike);
               
               pQuote.appendChild(qte);

               blkQuote.appendChild(pQuote);
               blkQuote.appendChild(br());
               blkQuote.appendChild(qteFooter);

               let l = li();
               l.appendChild(blkQuote);

               quoteList.appendChild(l);
            });
        })
        .catch(function(error){
            console.log(error.message);
        })
}

function removeAllChildNode(eleNode){
    while (eleNode.firstChild) {
        eleNode.removeChild(eleNode.firstChild);
    }
}

function addNewLike(obj) {
    let frmData = {
        quoteId: obj.id,
        createdAt: Date.parse(Date())
    };
    let configObj = {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(frmData)
    };
    let url = 'http://localhost:3000/likes'
    fetch(url,configObj)
        .then(response=>response.json())
        .then()
        .catch(function(error) {
            console.log(error.message);
        })
}

function addNewQuote(frmData) {
    let url = 'http://localhost:3000/quotes/';
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },      
        body: JSON.stringify(frmData)
    })
        .then(response=>response.JSON())
        .then()
        .catch(function(error){
            console.log(error.message);
        })
}

function deleteQuote(item) {
    let url = 'http://localhost:3000/quotes/' + item.id;
    fetch(url,{
        method:'DELETE'
    })
        .then(response=>response.json())
        .catch(function(error){
            console.log(error.message);
        });
}

function li() {
    return document.createElement('li');
}

function blockquote() {
    return document.createElement('blockquote');
}

function footer() {
    return document.createElement('footer');
}

function p() {
    return document.createElement('p');
}

function br() {
    return document.createElement('br');
}

function span() {
    return document.createElement('span');
}

function textNode (str) {
    return document.createTextNode(str);
}

btnCancelEdit.addEventListener('click', function() {
    let frm = this.parentNode;
    let container = frm.parentNode;
    container.className = 'hidden';
})

function showEditForm(item) {
    let frm = btnCancelEdit.parentNode;
    let container = frm.parentNode;
    frm.quote_id.value = item.id;
    frm.edit_quote.value = item.quote;
    container.className = '';
}

let editForm = btnCancelEdit.parentNode;
editForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (checkEditQuote(editForm)) {
        editQuote(editForm);
    }
    return false;
})

function checkEditQuote(form){
    let editQuote = form.edit_quote;
    if (editQuote.value == '' || !editQuote){
        alert('Quote could not be empty!');
        editQuote.focus;
        return false;
    }
    return true;
}

function editQuote(form) {
    let url = 'http://localhost:3000/quotes/' + form.quote_id.value;
    let obj = {
        quote:''
    };
    obj.quote = form.edit_quote.value;
    fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(obj)
        })
        .then(response => response.json())
        .then()
        .catch(function(error) {
            console.log(error.message);
        });
    let container = form.parentNode;
    container.className = 'hidden';
}

const btnSort = document.getElementById('sort');
btnSort.addEventListener('input',function(event) {
    event.preventDefault();
    loadQuotes();
})

function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}    
