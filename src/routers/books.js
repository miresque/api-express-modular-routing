const express = require("express");

const { books } = require("../../data.js");
const booksRouter = express.Router()
const findBookById = (bookId) => books.find(b => b.id === Number(bookId))
const findBookByTitle = (title) => books.find(b => b.title === title)

// get all books
booksRouter.get("/", (req, res) => {
    res.status(200).json({
      books
    })
})

// get book by id
booksRouter.get("/:id", (req, res) => {   
    if(!findBookById(req.params.id)) {
      return res.status(404).json(
          {
           error: "Error Book with provided ID not found"
          }
        )
    }
  
    res.status(200).json({
      film: findBookById(req.params.id)
    })
})

// create book
booksRouter.post("/", (req, res) => {
    if(!req.body.title || !req.body.author || !req.body.type) {
        return res.status(400).json(
            {
             error: "Error Missing fields in request body"
            }
        )
    }
    if(findBookByTitle(req.body.title)) {
         return res.status(409).json(
            {
             error: "A book with the provided title already exists"
            }
        )
    }
    books.push({ 
        "id": books.length + 1, 
        "title": req.body.title, 
        "type": req.body.type,
        "author": req.body.author
    })

    res.status(201).json({
      book: findBookByTitle(req.body.title)
    })
})

// delete a book by id
booksRouter.delete("/:id", (req, res) => {   
    const foundBook = findBookById(req.params.id) 
    if(!foundBook) {
      return res.status(404).json(
          {
           error: "Error Book with provided ID not found"
          }
        )
    }
    const index = books.findIndex(b => b === foundBook)
    books.splice(index, 1)

    res.status(200).json({
      film: foundBook
    })
})

// update a book by ID
booksRouter.put("/:id", (req, res) => { 
    const id = req.params.id

    if(!findBookById(id)) {
        return res.status(404).json(
            {
             error: "Error Book with provided ID not found"
            }
        )
    }
    if(findBookByTitle(req.body.title)) {
        return res.status(409).json(
            {
             error: "A book with the provided title already exists"
            }
        )
    }
    const index = books.findIndex(b => b === findBookById(id))
    const updatedBook = {
        ...findBookById(id),
        title: req.body.title, 
        type: req.body.type,
        author: req.body.author
    }
    books.splice(index, 1, updatedBook)

    res.status(200).json({
        book: findBookById(id)
    })
})


module.exports = booksRouter