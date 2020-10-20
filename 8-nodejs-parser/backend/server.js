const fs = require('fs')
var express = require('express');

var app = express();
app.use(express.json()); // JSON parser for post request
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // For POST CORS Error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});
var booksJsonFile = __dirname + '/books.json';

// Get content from a JSON file
app.get('/json_file', (req, res) => {
    try {
        let data = fs.readFileSync(`${__dirname}/${req.query.name}.json`)
        res.json(JSON.parse(data));
    } catch (err) {
        res.send({'error': err.toString()});
    }
});
// Create JSON file
app.put('/json_file', (req, res) => {
    try {
        const fileName = __dirname + '/' + req.query.name + '.json';
        let bodyData = req.body;
        fs.open(fileName, 'r', (err, fd) => {
            fs.writeFile(fileName, JSON.stringify(bodyData), (err) => { if(err)console.log(err); }); // Create new file
        })
        res.send({'success': 'File successfully created.'})
    } catch (err) {
        res.send({'error': err.toString()});
    }
});
// Update JSON file
app.post('/json_file', (req, res) => {
    try {
        const fileName = __dirname + '/' + 'books.json';
        let bodyData = req.body;
        fs.open(fileName, 'r', (err, fd) => {
            let books = JSON.parse(fs.readFileSync(fileName, 'utf8')); // Read file content
            bodyData.forEach(newBook => {
                books.push(newBook);
            })
            fs.writeFileSync(fileName, JSON.stringify(books)); // Write content to the file
        });
        res.send({'success': 'File successfully updated.'})
    } catch (err) {
        res.send({'error': err.toString()});
    }
});
// Delete JSON file
app.delete('/json_file', (req, res) => {
    try {
        fs.unlinkSync(__dirname + "/" + req.query.name + '.json');
        res.send({'success': 'File deleted.'})
    } catch (err) {
        res.send({'error': err.toString()});
    }
});
// Get book details
app.get('/book', (req, res) => {
    try {
        let books = JSON.parse(fs.readFileSync(booksJsonFile));
        const titleName = req.query.title;
        let responseBook = {}
        books.forEach(function(book, index) {
            if (book['title'] == titleName) {
                responseBook = book;
            }
        })
        res.json(responseBook);
    } catch (err) {
        res.send({'error': err.toString()});
    }
})
// Add new book
app.put('/book', (req, res) => {
    try {
        let bookInfo = req.body;
        fs.open(booksJsonFile, 'r', (err, fd) => {
            let fileContent = JSON.parse(fs.readFileSync(booksJsonFile, 'utf8')); // Read file content
            // let newBook = {
            //     'title': bookInfo['title'],
            //     'web_url': bookInfo['web_url'],
            //     'image_url': bookInfo['image_url']
            // };
            fileContent.push(bookInfo);
            fs.writeFileSync(booksJsonFile, JSON.stringify(fileContent)); // Write content to the file
        });
        res.send({'success': 'Add book successfully.'});
    } catch (err) {
        res.send({'error': err.toString()});
    }
})
// Update book details
app.post('/book', (req, res) => {
    try {
        let bookTitle = req.query.title;
        let bodyData = req.body;
        let found = false;
        fs.open(booksJsonFile, 'r', (err, fd) => {
            var books = JSON.parse(fs.readFileSync(booksJsonFile, 'utf8')); // Read file content
            books.forEach(function(book, index) {
                if (book['title'] == bookTitle) {
                    found = true;
                    book['title'] = bodyData['title'];
                    book['web_url'] = bodyData['web_url'];
                    book['image_url'] = bodyData['image_url'];
                }
            })
            if (found) {
                fs.writeFileSync(booksJsonFile, JSON.stringify(books)); // Write content to the file
                res.send({'success': 'Update book successfully.'});
            } else {
                res.send({'error': bookTitle + ' not found.'});
            }
        });
    } catch (err) {
        res.send({'error': err.toString()});
    }
});
// Delete book
app.delete('/book', (req, res) => {
    let bookTitle = req.query.title;
    let books = JSON.parse(fs.readFileSync(booksJsonFile));
    var bookIndex = -1;
    books.forEach(function(book, index) {
        if (book['title'] == bookTitle) {
            bookIndex = index;
        }
    })
    if (bookIndex > -1) {
        books.splice(bookIndex, 1);
        fs.writeFileSync(booksJsonFile, JSON.stringify(books));
        res.send({'success': 'Delete book successfully.'});
    } else {
        res.send({'error': bookTitle + ' not found.'});
    }
})

const port = 8080
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
