var express = require('express');
var app = express();
app.use(express.json()); // json parser for post request

app.get('/home', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

app.get('/json_data', function(req, res) {
    const data = require('./data.json'); 
    res.json(data);
});

app.get('/parameters', function(req, res) {
    const head_info = req.query.head;
    const para_info = req.query.para;
    head_html = '<h1>' + head_info + '</h1>' 
    paragraph_html = '<p>' + para_info + '</p>' 
    res.send(head_html + paragraph_html)
})

app.post('/handle', function(req, res) {
    console.log(req.body);
    res.json(req.body);
})

const port = 8080
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
