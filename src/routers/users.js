const express = require("express");

const { users } = require("../../data.js");
const usersRouter = express.Router()
const findUserById = (userId) => users.find(u => u.id === Number(userId))
const findUserByEmail = (email) => users.find(u => u.email === email)

// get all users
usersRouter.get("/", (req, res) => {
    res.status(201).json({
      users: users
    })
})

// get user by id
usersRouter.get("/:id", (req, res) => {   
    if(!findUserById(req.params.id)) {
      return res.status(404).json(
          {
           error: "Error User with provided ID not found"
          }
        )
    }
  
    res.status(200).json({
      user: findUserById(req.params.id)
    })
})

// create user
usersRouter.post("/", (req, res) => {
    if(!req.body.email) {
        return res.status(400).json(
            {
             error: "Error Missing fields in request body"
            }
        )
    }
    if(findUserByEmail(req.body.email)) {
         return res.status(409).json(
            {
             error: "A user with the provided email already exists"
            }
        )
    }
    users.push({ "id": users.length + 1, "email": req.body.email})

    res.status(201).json({
      user: findUserByEmail(req.body.email)
    })
})

// delete a user by id
usersRouter.delete("/:id", (req, res) => {   
    const foundUser = findUserById(req.params.id) 
    if(!foundUser) {
      return res.status(404).json(
          {
           error: "Error User with provided ID not found"
          }
        )
    }
    const index = users.findIndex(u => u === foundUser)
    users.splice(index, 1)

    res.status(200).json({
      user: foundUser
    })
})

// update a user by ID
usersRouter.put("/:id", (req, res) => { 
    const id = req.params.id

    if(!findUserById(id)) {
        return res.status(404).json(
            {
             error: "Error User with provided ID not found"
            }
        )
    }
    if(findUserByEmail(req.body.email)) {
        return res.status(409).json(
            {
             error: "A user with the provided email already exists"
            }
        )
    }
    const index = users.findIndex(u => u === findUserById(id))
    const updatedUser = {
        ...findUserById(id),
        email: req.body.email
    }
    users.splice(index, 1, updatedUser)

    res.status(200).json({
        user: findUserById(id)
    })
})


module.exports = usersRouter