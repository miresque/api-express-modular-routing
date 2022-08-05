const express = require("express");

const { films } = require("../../data.js");
const filmsRouter = express.Router()
const findFilmById = (filmId) => films.find(f => f.id === Number(filmId))
const findFilmByTitle = (title) => films.find(f => f.title === title)

// get all films
filmsRouter.get("/", (req, res) => {
    res.status(200).json({
      films
    })
})

// get film by id
filmsRouter.get("/:id", (req, res) => {   
    if(!findFilmById(req.params.id)) {
      return res.status(404).json(
          {
           error: "Error Film with provided ID not found"
          }
        )
    }
  
    res.status(200).json({
      film: findFilmById(req.params.id)
    })
})

// create film
filmsRouter.post("/", (req, res) => {
    if(!req.body.title || !req.body.director) {
        return res.status(400).json(
            {
             error: "Error Missing fields in request body"
            }
        )
    }
    if(findFilmByTitle(req.body.title)) {
         return res.status(409).json(
            {
             error: "A film with the provided title already exists"
            }
        )
    }
    films.push({ 
        "id": films.length + 1, 
        "title": req.body.title, 
        "director": req.body.director
    })

    res.status(201).json({
      film: findFilmByTitle(req.body.title)
    })
})

// delete a film by id
filmsRouter.delete("/:id", (req, res) => {   
    const foundFilm = findFilmById(req.params.id) 
    if(!foundFilm) {
      return res.status(404).json(
          {
           error: "Error Film with provided ID not found"
          }
        )
    }
    const index = films.findIndex(f => f === foundFilm)
    films.splice(index, 1)

    res.status(200).json({
      film: foundFilm
    })
})

// update a film by ID
filmsRouter.put("/:id", (req, res) => { 
    const id = req.params.id

    if(!findFilmById(id)) {
        return res.status(404).json(
            {
             error: "Error Film with provided ID not found"
            }
        )
    }
    if(findFilmByTitle(req.body.title)) {
        return res.status(409).json(
            {
             error: "A film with the provided title already exists"
            }
        )
    }
    const index = films.findIndex(u => u === findFilmById(id))
    const updatedFilm = {
        ...findFilmById(id),
        title: req.body.title,
        director: req.body.director
    }
    films.splice(index, 1, updatedFilm)

    res.status(200).json({
        film: findFilmById(id)
    })
})


module.exports = filmsRouter