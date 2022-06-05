// import packages to run the express app
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");

// middleware
app.use(cors());
app.use(bodyParser.json());

// in-memory data store is an array of javascript objects
var books = [
    { "author": "me", "title": "BookA", "pages": 600, "quality": "new" },
    { "author": "you", "title": "BookB", "pages": 400, "quality": "used" },
    { "author": "us", "title": "BookC", "pages": 500, "quality": "old" },
];

// GET request handler to search based on title
app.get('/book', function (req, res) {
    res.set('Content-type', 'application/json');

    // get the query params
    var title = req.query.title;

    // initialize the return data
    var data;

    // search for the book
    for (var i = 0; i < books.length; i++) {
        if (books[i].title == title) {
            data = books[i];
            break;
        }
    }

    // pass JSON back to client
    res.status(200).send({"book": data});
});

// POST handler to add a book to the hardcoded list
app.post('/book', function (req, res) {
    res.set('Content-type', 'application/json');

    var data = req.body;
    if (Object.keys(data).length === 0) {
        res.status(415).send({
            error:"bad request",
            "message":"content-type must be set to JSON"
        });
        return
    }

    // check if any fields are empty
    var validBook = true;
    if (data.author == undefined || data.author === "")
        validBook = false;
    if (data.title == undefined || data.title === "")
        validBook = false;
    if (data.pages == undefined || data.pages === "")
        validBook = false;
    if (data.quality == undefined || data.quality === "")
        validBook = false;

    // if any fields are missing it's a bad request
    if (!validBook) {
        res.status(400).send({
            "error":"bad request",
            "message": "author, title, pages, quality are required"
        });
        return
    }

    // only set the fields we want, ignore extra fields
    var newBook = {
        "author": data.author,
        "title": data.title,
        "pages": data.pages,
        "quality": data.quality
    }

    // add the book to the hardcoded list of books
    books.push(newBook);

    // return JSON list of books
    res.status(201).send({"books": books});
});

// GET ALL handler returns all books
app.get('/books', function (req, res) {
    res.set('Content-type', 'application/json');

    // return all books
    res.status(200).send({"books": books});
});

// DELETE handler deletes book by title
app.delete('/book', function (req, res) {
    var title = req.query.title;

    // update the collection of books with the book removed
    books = books.filter(b => {
        return b.title !== title;
    });

    // can also be res.status(204).send();
    res.sendStatus(204);
});

// listen for HTTP requests on port 3000
app.listen(3000, function() {
    console.log("listening on port 3000");
});