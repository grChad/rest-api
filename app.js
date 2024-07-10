const express = require('express')
const crypto = require('node:crypto')
const moviesJSON = require('./movies.json')
const cors = require('cors')

const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

app.use(express.json())
app.use(cors()) // use cors
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

app.get('/movies', (_, res) => {
  return res.json(moviesJSON)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find((movie) => movie.id === id)

  if (movie) return res.json(movie)

  res.status(404).json({ error: 'no se encontro la pelicula' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body) // with zod

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  // Esto no es REST porque se guarda en la memoria
  moviesJSON.push(newMovie)

  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex((mov) => mov.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  moviesJSON.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body) // with zod
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = moviesJSON.findIndex((mov) => mov.id === id)

  if (movieIndex < 0) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  console.log('no se que pasa')
  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data
  }

  moviesJSON[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
