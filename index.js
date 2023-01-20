require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// MORGAN LOGGER

morgan.token('data', (req, res) => {
  const {body} = req
  if (Object.keys(body).length === 0) return
  return JSON.stringify(body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms. Data: :data')
)

// ROUTES

// Info
app.get('/info', (request, response) => {
  let date = new Date()
  Person.find({}).then(people => {
    response.send(
      `<b>Phonebook contains info for ${people.length} people</b><p>${date}</p>`  
    )
  })
})

// Fetch All
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

// Fetch by ID
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch((error) => {
      console.log('Error finding phonebook entry', error)
      response.status(404).end()
    })
})

// Delete
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(person => person.id !== id)
  response.status(204).end()
})

// Create/Update
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name) {
    return response.status(400).json({
      error: 'Entry must include a name'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Entry must include a number'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(newPerson => {
    response.json(newPerson)
  })
})

// PORT LISTENER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})