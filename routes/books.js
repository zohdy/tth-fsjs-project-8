const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

/* GET books listing */
router.get('/', (req, res) => {
    Book.findAll({ order: [["title", "ASC"]]})
        .then( books => res.render('index', { books: books, title: 'Book Library' }))
        .catch(error => res.send(500, error));
});

/* POST create book */
router.post('/new', (req, res) => {
    Book.create(req.body)
        .then(() => res.redirect('/books'))
        .catch(err => {
            if(err.name === 'SequelizeValidationError'){
                res.render('new-book', { title: 'New Book', book: Book.build(req.body), errors: err.errors});
            } else {
                throw err;
            }
        }).catch(error => res.send(500, error));
});

/* Create a new book form */
router.get('/new', (req, res) => {
    res.render('new-book',  { title: 'New Book', book: {} })
});

/* GET individual book */
router.get('/:id', (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if(book) {
                res.render("update-book", { book: book, title: book.title});
            } else {
                const error = new Error('Page not Found');
                res.render('page-not-found', {error: error, title: `${error.status}-${error.message}`})
            }
        }).catch(error => res.send(500 , error));
});


/* POST update book */
router.post('/:id', (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if(book){
                return book.update(req.body)
            } else {
                const error = new Error('Page not Found');
                res.render('page-not-found', {error: error, title: `${error.status}-${error.message}`})
            }
        }).then(() => res.redirect('/books'))
          .catch( err => {
            if(err.name === 'SequelizeValidationError'){
                const book = Book.build(req.body);
                book.id = req.params.id;
                res.render('update-book', { title: 'Update Book', book: book, errors: err.errors});
            } else {
                throw err;
            }
        }).catch(error => res.send(500, error));
});

/* DELETE individual book. */
router.post('/:id/delete', (req, res) =>{
    Book.findById(req.params.id)
        .then(book => {
            if(book){
                return book.destroy();
            } else {
                const error = new Error('Page not Found');
                res.render('page-not-found', {error: error, title: `${error.status}-${error.message}`})
            }
        }).then( () => res.redirect('/books'))
        .catch(error => res.send(500, error));
});


module.exports = router;
