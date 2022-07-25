const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
console.log("connecting to ", url)

mongoose.connect(url)
.then(results => {
    console.log("Connected to MongoDB")
})
.catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

/*
if (process.argv.length === 3) {
    Person
    .find({})
    .then(result => {
        result.forEach(person => console.log(person))
        mongoose.connection.close()
    })
    
}

else if (process.argv.length > 3) {
const person =  new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
})
}
*/
module.exports = mongoose.model("Person", personSchema)