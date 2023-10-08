import mongoose from 'mongoose'

import app from './app.js'
<<<<<<< Updated upstream
=======



mongoose.connect(process.env.DB_HOST)
  .then(() => {
    app.listen(3000, () => {
  console.log("Database connection successful")
})
  })
  .catch(error => {
    console.log(error.message)
    process.exit(1)
  })
// pass mongo: 228228
>>>>>>> Stashed changes


