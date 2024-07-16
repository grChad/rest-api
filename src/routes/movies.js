import { Router } from 'express'

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import MovieModel from '../models/movies.js'

const Model = new MovieModel()

export const movieRouter = Router()

movieRouter.get('/', async (req, res) => {
	const { genre } = req.query
	const movies = await Model.getAll({ genre })

	return res.json(movies)
})

movieRouter.get('/:id', async (req, res) => {
	const { id } = req.params
	const movie = await Model.getById({ id })

	if (movie) return res.json(movie)

	res.status(404).json({ error: 'no se encontro la pelicula' })
})

movieRouter.post('/', async (req, res) => {
	const result = validateMovie(req.body) // with zod

	if (!result.success) {
		return res.status(400).json({ error: JSON.parse(result.error.message) })
	}

	const newMovie = await Model.create({ input: result.data })
	res.status(201).json(newMovie)
})

movieRouter.delete('/:id', async (req, res) => {
	const { id } = req.params
	const result = await Model.delete({ id })

	if (result === false) {
		return res.status(404).json({ message: 'Movie not found' })
	}

	return res.json({ message: 'Movie deleted' })
})

movieRouter.patch('/:id', async (req, res) => {
	const result = validatePartialMovie(req.body) // with zod
	if (!result.success) {
		return res.status(400).json({ error: JSON.parse(result.error.message) })
	}

	const { id } = req.params
	const updateMovie = await Model.update({ id, input: result.data })

	return res.json(updateMovie)
})
