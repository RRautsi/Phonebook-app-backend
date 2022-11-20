require("dotenv").config()
const mongoose = require("mongoose")

if (process.argv.length === 3) {
  console.log("give password as argument")
  process.exitCode = 1
} else if (process.argv.length === 4) {
  console.log("give contact name as argument")
  process.exitCode = 1
} else if (process.argv.length === 5) {
  console.log("give contact number as argument")
  process.exitCode = 1
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]
const url = process.env.MONGO_URI

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model("Contact", contactSchema)

const contact = new Contact({
  name: contactName,
  number: contactNumber,
})

if (contact.name && contact.number) {
  contact.save().then((result) => {
    console.log(
      `Added new contact. Name: ${result.name} Number: ${result.number}`
    )
    mongoose.connection.close()
  })
} else {
  Contact.find({}).then((result) => {
    console.log("Phonebook:")
    result.forEach((contact) => {
      console.log(contact.name, contact.number)
    })
    mongoose.connection.close()
  })
}
