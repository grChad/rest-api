import express from 'express'
import cors from 'cors'
import { movieRouter } from './router.js'

const app = express()

app.use(express.json())
app.use(cors()) // use corskjkjuj
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

app.use('/movies', movieRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
