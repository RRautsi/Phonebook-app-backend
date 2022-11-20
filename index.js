require("dotenv").config()
const Contact = require("./models/contact")
const Morgan = require("./models/morgan")
const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use(express.static("build"))
app.use(Morgan)

app.get("/", (req, res) => {
  res.send("This is the root of backend")
})

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts)
  })
})

app.get("/info", (req, res) => {
  let contactCount = 0
  Contact.find({}).then((contacts) => {
    contactCount = contacts.length
    res.send(
      `Phonebook has info for ${contactCount} people<br/><br/>${new Date()}`
    )
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Contact.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))   
})

app.post("/api/persons/", (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number missing"
    })
  }
  const contact = new Contact({
    name: body.name,
    number: body.number,
  })
  contact.save()
    .then((savedContact) => {
      res.json(savedContact)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  const body = req.body

  Contact.findByIdAndUpdate(id, {number: body.number}, {new: true})
  .then(result => {
    res.json(result)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint, check address' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).send({ error: "Malformatted id" })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
