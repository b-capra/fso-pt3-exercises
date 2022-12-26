const express = require('express')
const data = require('./data.json')
const app = express()

app.use(express.json())

app.get('/info', (request, response) => {
  let date = new Date()
  response.send(
    `<b>Phonebook contains info for ${data.length} people</b><p>${date}</p>`
  )
  console.log(response)
})

app.get('/api/persons', (request, response) => {
  response.json(data)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})