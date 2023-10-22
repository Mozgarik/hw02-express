import express from "express"
import logger from 'morgan'
import cors from 'cors'

<<<<<<< Updated upstream
import contactsRouter from "./routes/api/contacts.js"
=======

import "dotenv/config"

import usersRouter from "./routes/api/users-router.js"

import contactsRouter from "./routes/api/contact-router.js"
>>>>>>> Stashed changes


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))


<<<<<<< Updated upstream
=======
app.use('/api/users', usersRouter)
>>>>>>> Stashed changes
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

export default app
