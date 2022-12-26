const express = require('express')
let data = require('./data.json')
const app = express()

app.use(express.json())

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

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  data = data.concat(newPerson)

  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})