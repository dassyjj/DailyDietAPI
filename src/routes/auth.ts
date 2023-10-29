import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function auth(app: FastifyInstance) {
  app.post('/register', async (req, reply) => {
    const registerBodySchema = z.object({
      username: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { username, email, password } = registerBodySchema.parse(req.body)

    await knex('users')
      .where('username', username)
      .orWhere('email', email)
      .first()
      .then((user) => {
        if (user?.username === username) {
          throw new Error('username address already exists')
        }

        if (user?.email === email) {
          throw new Error('email address already exists')
        }
      })

    const user = {
      id: randomUUID(),
      username,
      email,
      password,
    }
    await knex('users').insert(user)

    reply.cookies('sessionId', user.id).status(201).send()
  })

  app.post('/login', async (req, reply) => {
    const loginBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = loginBodySchema.parse(req.body)

    try {
      const user = await knex('users')
        .where({
          email,
          password,
        })
        .first()

      reply.cookies('sessionId', user.id, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    } catch (e) {
      reply.status(400).send()
    }
  })
}
