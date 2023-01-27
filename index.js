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
app.get('/api/persons/:id', (request, response, next) => {
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

// Delete
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Create
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  Person.findOne({ name: body.name })
    .then(match => {
      if (match) {
        response.status(400).send({ error: 'Name already exists' })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })
      
        person.save()
          .then(newPerson => {
            response.json(newPerson)
          })
          .catch(error => next(error))
      }
    })
})

// Update
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    {name, number},
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// ERROR HANDLERS
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// PORT LISTENER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})