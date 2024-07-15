import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title is required',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string({
    invalid_type_error: 'Movie director is type String',
    required_error: 'Movie director is required'
  }),
  duration: z.number().int().positive(),
  poster: z.string().url({ message: 'Poster must be a valid URL' }),
  genre: z.array(z.enum(['Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance']), {
    required_error: 'Movie genre is required',
    invalid_type_error: 'Movie genre must be an array of enum Genre'
  }),
  rate: z.number().min(0).max(10).default(5.5)
})

export function validateMovie (input) {
  return movieSchema.safeParse(input)
}

export function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}
