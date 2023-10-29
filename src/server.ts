import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { auth } from './routes/auth.js'
import { snack } from './routes/snack.js'

const app = fastify()

app.register(cookie)

app.register(auth, {
  prefix: 'auth',
})

app.register(snack, {
  prefix: 'snack',
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
