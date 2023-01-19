const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fso-3-pb:${password}@phonebook-db.bqkudsw.mongodb.net/phonebookApp?retryWrites=true&w=majority`

// Schema
const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})
// Model
const Person = mongoose.model('Person', personSchema)

// Query Current Entries
if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then((result) => {
      Person
        .find({})
        .then(people => {
          console.log('Phonebook:')
          people.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
        mongoose.connection.close()
        })
    })
}

// New Entry
if (process.argv.length === 5) {
  const nameRegex = /^[a-zA-Z,.'-\s]+$/
  const numRegex = /^[0-9\-]+$/
  
  if (!nameRegex.test(process.argv[3])) {
    console.log('Please provide a valid name')
    process.exit(1)
  }

  if (!numRegex.test(process.argv[4])) {
    console.log('Please provide a valid number')
    process.exit(1)
  }

  mongoose
    .connect(url)
    .then((result) => {
      const person = new Person({
        id: Math.floor(Math.random() * (100) + 1),
        name: process.argv[3],
        number: process.argv[4]
      })
      return person.save()
    })
    .then(() => {
      console.log(`Added ${process.argv[3]} with number ${process.argv[4]} to the phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

if (process.argv.length >= 6) {
  console.log('Too many arguments. Usage:')
  console.log('Query entries: node mongo.js <password>')
  console.log('New entry: node mongo.js <password> <name> <number>')
  console.log('Names with spaces must be enclosed in quotes')
}
