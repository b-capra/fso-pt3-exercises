const express = require('express')
const morgan = require('morgan')
let data = require('./data.json')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

// ROUTES

app.get('/info', (request, response) => {
  let date = new Date()
  response.send(
    `<b>Phonebook contains info for ${data.length} people</b><p>${date}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * (100 - data.length + 1) + data.length)
}

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

  if (data.map(person => person.name).includes(body.name)) {
    return response.status(400).json({
      error: 'Entry name must be unique'
    })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  data = data.concat(newPerson)

  response.json(newPerson)
})

// PORT LISTENER

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.debug('App listening on :3001')
})