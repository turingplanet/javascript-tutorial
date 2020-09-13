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
                        `<div><button onClick=getBookDetails('${key}') style="float:left">Update</button><button style="float:right">Delete</button></div></div>`;
    }
    document.getElementById("main-content").innerHTML = newContent;
}
function clearJSON() {
    document.getElementById("json-content").innerHTML = "";
}
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
    var newContent = `<h1>${bookTitle}</h1>`;
    newContent += `<img src="${imageUrl} style="float:left"></a>`;
    newContent += `<p>Link: ${webUrl}</p>`;
    document.getElementById("main-content").innerHTML = newContent;
}
