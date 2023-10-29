import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { auth } from './routes/auth'
import { snack } from './routes/snack'

export const app = fastify()

app.register(cookie)

app.register(auth, {
  prefix: 'auth',
})

app.register(snack, {
  prefix: 'snack',
})
