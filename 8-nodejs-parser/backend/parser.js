const puppeteer = require('puppeteer');
var express = require('express');

var app = express();
app.use(express.json()); // JSON parser for post request
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // For POST CORS Error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});

var books = [];

async function scrapeAmazon(url, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // Get hrefs
    const hrefs = await Promise.all((await page.$$('a.bookTitle')).map(async a => {
        return await (await a.getProperty('href')).jsonValue();
    }));
    hrefs.forEach(async href => {
        getBookInfo(href, hrefs.length, res);
    })
    browser.close();
}

async function getBookInfo(url, length, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // Get image url
    const [image] = await page.$x('//*[@id="coverImage"]');
    const src = await image.getProperty('src');
    const txt = await src.jsonValue();
    const title = await page.$('#bookTitle');
    const text = await (await title.getProperty('textContent')).jsonValue();
    var newObj = {
        'title': text.trim(),
        'web_url': url,
        'image_url': {txt}.txt
    };
    books.push(newObj);
    if (books.length == length) {
        console.log(books);
        res.json(books);
        books = []
    }
    browser.close();
}

app.get('/crawler', (req, res) => {
    try {
        let url = req.query.url;
        scrapeAmazon(url, res);
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

const port = 8081
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
