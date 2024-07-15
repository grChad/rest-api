import { Router } from 'express'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'

const newrequire = createRequire(import.meta.filename)
const movieJSON = newrequire('./movies.json')

export const movieRouter = Router()

movieRouter.get('/', (_, res) => {
  return res.json(movieJSON)
})

movieRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = movieJSON.find((movie) => movie.id === id)

  if (movie) return res.json(movie)

  res.status(404).json({ error: 'no se encontro la pelicula' })
})

movieRouter.post('/', (req, res) => {
  const result = validateMovie(req.body) // with zod

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  // Esto no es REST porque se guarda en la memoria
  movieJSON.push(newMovie)

  res.status(201).json(newMovie)
})

movieRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movieJSON.findIndex((mov) => mov.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movieJSON.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

movieRouter.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body) // with zod
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movieJSON.findIndex((mov) => mov.id === id)

  if (movieIndex < 0) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  console.log('no se que pasa')
  const updateMovie = {
    ...movieJSON[movieIndex],
    ...result.data
  }

  movieJSON[movieIndex] = updateMovie

  return res.json(updateMovie)
})
