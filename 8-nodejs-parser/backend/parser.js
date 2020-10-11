var express = require('express');
var app = express();
app.use(express.json()); // JSON parser for post request
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // For POST CORS Error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});
const puppeteer = require('puppeteer');

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
    // console.log({txt}.txt);
    // Get title 
    // const [title] = await page.$x('//*[@id="bookTitle"]');
    const title = await page.$('#bookTitle');
    const text = await (await title.getProperty('textContent')).jsonValue();
    // console.log(text.trim());
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

// getBookInfo('https://www.goodreads.com/book/show/95708.The_Now_Habit?from_search=true&from_srp=true&qid=jj1bcCHcPy&rank=2');

// scrapeAmazon('https://www.goodreads.com/search?q=programming');

app.get('/crawler', (req, res) => {
    try {
        let url = req.query.url;
        console.log(url);
        scrapeAmazon(url, res);
    } catch (err) {
        console.error(err);
        res.send({'error': err.toString()});
    }
});

const port = 8081
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})