import { randomUUID } from 'node:crypto'
import { readJSON } from '../utils.js'
const moviesJSON = readJSON('./movies.json')

export default class MovieModel {
	constructor() {
		this.movies = moviesJSON
	}

	async getAll({ genre }) {
		if (genre) {
			return this.movies.filter((movie) =>
				movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
			)
		}
		return this.movies
	}

	async getById({ id }) {
		const movie = this.movies.find((movie) => movie.id === id)
		return movie
	}

	async create({ input }) {
		const newMovie = {
			id: randomUUID(),
			...input,
		}

		const movie = this.movies.push(newMovie)
		return movie
	}

	async delete({ id }) {
		const movieIndex = this.movies.findIndex((mov) => mov.id === id)
		if (movieIndex === -1) return false

		this.movies.splice(movieIndex, 1)
		return true
	}

	async update({ id, input }) {
		const movieIndex = this.movies.findIndex((mov) => mov.id === id)
		if (movieIndex === -1) return false

		this.movies[movieIndex] = {
			...this.movies[movieIndex],
			...input,
		}

		return this.movies[movieIndex]
	}
}
