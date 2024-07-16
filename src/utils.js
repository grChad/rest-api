import { createRequire } from 'node:module'

const newRequire = createRequire(import.meta.filename)

export const readJSON = (path) => newRequire(path)
