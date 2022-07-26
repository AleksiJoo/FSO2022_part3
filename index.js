const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
require("dotenv").config()
const Person = require("./models/person")
app.use(express.static("build"))
app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :response-time ms :body"))


morgan.token("body", (req, res) => JSON.stringify(req.body))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"

    }
]



app.get("/api/persons", (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
         <p>${new Date()}</p>`)
    
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
    response.status(404).end()}
})

app.delete("/api/persons/:id", (request, response) =>{
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons/", (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    } 

    const person = new Person({
        name: body.name,
        number: body.number,
        //id: Math.floor(Math.random() * 100)
    })

    /*if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })*/

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

