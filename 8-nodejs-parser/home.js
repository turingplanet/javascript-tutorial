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
function displayData(xhttp) {
    var jsonData = JSON.parse(xhttp.responseText);
    var newContent = "";
    for (var key in jsonData) {
        newContent += `<div class="gallery"><a target="_blank" href="${jsonData[key].web_url}">` + 
                        `<img src="${jsonData[key].image_url}" width="600" height="400"></a>` + 
                        `<div class='desc'>${key}</div>` + 
                        `<div><button onClick=getBookDetails('${key}') style="float:left">Update</button>` + 
                        `<button style="float:right" onClick=deleteBook('${key}')>Delete</button></div></div>`;
    }
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
    var newContent = `<img src="${imageUrl}"></a>`;
    newContent += `<div><label>Title:</label><input id="titleInput" type="text" value='${bookTitle}' size='50'></input></div>`;
    newContent += `<div><label>Web URL:</label><input id="webUrlInput" type="text" value='${webUrl}' size='50'></input></div>`;
    newContent += `<div><label>Image URL:</label><input id="imageUrlInput" type="text" value='${imageUrl}' size='50'></input></div>`;
    newContent += `<div><button onClick=updateBook('${bookTitle}') style="float:left">Update</button>` + 
                  `<button style="float:right" onClick=deleteBook('${bookTitle}')>Delete</button></div></div>`;
    document.getElementById("main-content").innerHTML = newContent;
}

// Update Book Details
function updateBook(originalTitle) {
    newTitle = document.getElementById('titleInput').value;
    newWebUrl = document.getElementById('webUrlInput').value;
    newImageUrl = document.getElementById('imageUrlInput').value;
    newJSON  = {'title': newTitle, 'web_url': newWebUrl, 'image_url': newImageUrl};
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
