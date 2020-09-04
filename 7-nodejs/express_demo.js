var express = require('express');
var app = express();
const port = 8080

app.get('/home', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

app.get('/json', function(req, res) {
    const data = require('./data.json'); 
    res.json(data);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
