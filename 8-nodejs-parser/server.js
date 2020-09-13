const fs = require('fs')
var express = require('express');
var app = express();
app.use(express.json()); // JSON parser for post request
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});

booksJsonFile = __dirname + '/books.json';

app.get('/json_file', (req, res) => {
    try {
        let data = fs.readFileSync(`${__dirname}/${req.query.name}.json`)
        res.json(JSON.parse(data));
    } catch (err) {
        console.error(err);
        res.send({'error': err.toString()});
    }
});

// get book details
app.get('/book', (req, res) => {
    try {
        let data = JSON.parse(fs.readFileSync(booksJsonFile));
        const titleName = req.query.name;
        res.json(data[titleName]);
    } catch (err) {
        console.error(err);
        res.send({'error': err.toString()});
    }
})

app.post('/json_file', (req, res) => {
    try {
        const fileName = __dirname + '/' + req.query.name + '.json';
        bodyData = req.body;
        fs.open(fileName, 'r', (err, fd) => {
            if (err) {
                fs.writeFile(fileName, JSON.stringify(bodyData), (err) => { if (err) console.log(err); }); // Create new file
            } else {
                let fileContent = JSON.parse(fs.readFileSync(fileName, 'utf8')); // Read file content 
                Object.keys(bodyData).forEach( (key) => {fileContent[key] = bodyData[key];});
                console.log(fileContent);
                fs.writeFileSync(fileName, JSON.stringify(fileContent)); // Write content to the file
            }
        })
        res.send({'success': 'File successfully updated.'})
    } catch (err) {
        console.log(err);
        res.send({'error': 'Update json file failed.'})
    }
})

app.delete('/json_file', (req, res) => {
    try {
        fs.unlinkSync(__dirname + "/" + req.query.name + '.json');
        res.send({'success': 'File deleted.'})
    } catch (err) {
        console.log(err);
        res.send({'error': 'Delete file failed.'})
    }
});


app.delete('/book', (req, res) => {
    let bookTitle = req.query.title;
    let jsonData = JSON.parse(fs.readFileSync(booksJsonFile));
    delete jsonData[bookTitle]
    fs.writeFileSync(booksJsonFile, JSON.stringify(jsonData));
    res.send({'success': 'File content updated.'});
})

const port = 8080
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
