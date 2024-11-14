const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return String(Math.floor(Math.random() * 10000000) + 1)
}

const nameExists = (name) => {
  return persons.find(p => p.name === name)
}

app.use(express.json())
app.use(cors())
morgan.token('data', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (request, response) => {
  response.send('<h1>Check http://localhost:3001/api/persons</h1>')
})

app.get('/info', (request, response) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p><p>${(new Date)}`
  response.send(info)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  console.log(person)

  if (person) {
    response.json(person)
  } else {
    console.log(`No person exists with id ${id}`)
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

    if (!body.name) {
    return response.status(404).json({
      error: 'name is missing'
    })
  } else if (!body.number) {
    return response.status(404).json({
      error: 'number is missing'
    })
  } else if (nameExists(body.name)) {
    return response.status(404).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  console.log(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})