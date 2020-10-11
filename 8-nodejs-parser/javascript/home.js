const urlRoot = 'http://localhost:8080';

// Load local books
function loadBooks() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        displayData(this);
        }
    };
    xhttp.open("GET", "http://localhost:8080/json_file?name=books", true);
    xhttp.send();
}

function processTitle(title) {
    if (title.length > 20) {
        title = title.substring(0, 20) + "...";
    } 
    console.log(title);
    return title
}

function displayData(xhttp) {
    var books = JSON.parse(xhttp.responseText);
    var newContent = "<div class='booksGallery'>";
    books.forEach(function(book) {
        var processedTitle = processTitle(book.title);
        book.title = book.title.replace(/\s/g, '%20');
        newContent += `<div class="gallery"><a target="_blank" href="${book.web_url}">` + 
                        `<img id="bookImage" src="${book.image_url}" width="600" height="400"></a>` + 
                        `<div onClick=getBookDetails('${book.title}') class='desc'>${processedTitle}</div></div>`;
                        // `<div><button class="btn btn-light" onClick=getBookDetails('${book.title}') style="margin-top:10px;float:middle">${processedTitle}</button></div></div>`;
                        // `<button class="btn btn-danger" style="float:right" onClick=deleteBook('${book.title}')>Delete</button></div></div>`;
    })
    newContent += "</div>";
    document.getElementById("main-content").innerHTML = newContent;
}
function clearJSON() {
    document.getElementById("json-content").innerHTML = "";
}

// Get details
function getBookDetails(bookTitle) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {displayBookDetail(bookTitle, this);}
    };
    xhttp.open("GET", `http://localhost:8080/book?name=${bookTitle}`, true);
    xhttp.send();
}

function displayBookDetail(bookTitle, xhttp) {
    var jsonData = JSON.parse(xhttp.responseText);
    var imageUrl = jsonData['image_url'];
    var webUrl = jsonData['web_url'];
    var newContent = `<img id="bookImage" src="${imageUrl}"></a>`;
    newContent += `<div><label>Title:</label> <input id="titleInput" type="text" value='${bookTitle}' size='50'></input></div>`;
    newContent += `<div><label>Web URL:</label> <input id="webUrlInput" type="text" value='${webUrl}' size='50'></input></div>`;
    newContent += `<div><label>Image URL:</label> <input id="imageUrlInput" type="text" value='${imageUrl}' size='50'></input></div>`;
    newContent += `<div><button class="btn btn-success" onClick=updateBook('${bookTitle}') style="float:left">Update</button>` + 
                  `<button class="btn btn-danger" style="float:right" onClick=deleteBook('${bookTitle}')>Delete</button></div></div>`;
    document.getElementById("main-content").innerHTML = newContent;
}

// Update Book Details
function updateBook(originalTitle) {
    var newTitle = document.getElementById('titleInput').value;
    var newWebUrl = document.getElementById('webUrlInput').value;
    var newImageUrl = document.getElementById('imageUrlInput').value;
    var newJSON  = {'title': newTitle, 'web_url': newWebUrl, 'image_url': newImageUrl};
    updateBookInJSON(originalTitle, newJSON, function(){
        document.getElementById("main-content").innerHTML = `<h1>Book Updated!</h1>`;
    });
}

function updateBookInJSON(originalTitle, newJSON, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${urlRoot}/book?title=${originalTitle}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json"); 
    xhttp.send(JSON.stringify(newJSON));
    callback();
}

// Delete book
function deleteBook(bookTitle) {
    if (confirm(`Do you want to delete the book "${bookTitle}"?`)) {
        deleteBookInJson(bookTitle, function(){ 
            document.getElementById("main-content").innerHTML = `<h1>"${bookTitle}" Deleted!</h1>`;
        });
    } 
}

function deleteBookInJson(bookTitle, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://localhost:8080/book?title=${bookTitle}`, true);
    xhttp.send();
    callback();
}

// Add new book
function addNewBook() {
    var newContent = `<div><label>Title:</label> <input id="titleInput" type="text" value='bookTitle' size='50'></input></div>`;
    newContent += `<div><label>Web URL:</label> <input id="webUrlInput" type="text" value='webUrl' size='50'></input></div>`;
    newContent += `<div><label>Image URL:</label> <input id="imageUrlInput" type="text" value='imageUrl' size='50'></input></div>`;
    newContent += `<div><button class="btn btn-warning" onClick=addBook() style="float:middle">Add New Book</button></div></div>`;
    document.getElementById("main-content").innerHTML = newContent;
}
function addBook() {
    var title = document.getElementById('titleInput').value;
    var webURL = document.getElementById('webUrlInput').value;
    var imageURL = document.getElementById('imageUrlInput').value;
    var newJSON  = {'title': title, 'web_url': webURL, 'image_url': imageURL};
    addBookInJSON(newJSON, function(){
        document.getElementById("main-content").innerHTML = `<h1>New Book Added!</h1>`;
    });
}
function addBookInJSON(newBook, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `${urlRoot}/book`, true);
    xhttp.setRequestHeader("Content-Type", "application/json"); 
    xhttp.send(JSON.stringify(newBook));
    callback();
}
