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


morgan.token("body", (req) => JSON.stringify(req.body))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


app.get("/api/persons", (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons/", (request, response, next) => {
    const body = request.body
    console.log(body)

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)