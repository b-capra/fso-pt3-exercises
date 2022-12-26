const express = require('express')
const data = require('./data.json')
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})