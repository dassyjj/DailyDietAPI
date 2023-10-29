import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function snack(app: FastifyInstance) {
  app.get('/', { preHandler: checkSessionIdExists }, async (req, reply) => {
    const sessionId = req.cookies.sessionId

    await knex('snacks')
      .where('user_id', sessionId)
      .then((snacks) => {
        reply.status(200).send({
          snacks,
        })
      })
      .catch((error) => reply.status(400).send(error))
  })

  app.get('/:id', { preHandler: checkSessionIdExists }, async (req, reply) => {
    const sessionId = req.cookies.sessionId

    const getSnackParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getSnackParamsSchema.parse(req.params)

    await knex('snacks')
      .where({
        id,
        user_id: sessionId,
      })
      .first()
      .then((snacks) => {
        reply.status(200).send({
          snacks,
        })
      })
      .catch((error) => reply.status(400).send(error))
  })

  app.post(
    '/',
    {
      preHandler: checkSessionIdExists,
    },
    async (req, reply) => {
      const snackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
      })

      const { name, diet, description } = snackBodySchema.parse(req.body)

      const sessionId = req.cookies.sessionId

      await knex('snacks').insert({
        id: randomUUID(),
        user_id: sessionId,
        name,
        description,
        diet,
      })

      reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: checkSessionIdExists,
    },
    async (req, reply) => {
      const sessionId = req.cookies.sessionId

      const getSnackParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getSnackParamsSchema.parse(req.params)

      await knex('snacks')
        .where({
          id,
          user_id: sessionId,
        })
        .first()
        .del()
        .then(() => {
          reply.status(204).send()
        })
        .catch((err) => {
          reply.status(400).send(err)
        })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: checkSessionIdExists,
    },
    async (req, reply) => {
      const sessionId = req.cookies.sessionId

      const getSnackParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getSnackParamsSchema.parse(req.params)

      const getSnackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
      })

      const { name, diet, description } = getSnackBodySchema.parse(req.body)

      await knex('snacks')
        .where({
          id,
          user_id: sessionId,
        })
        .first()
        .update({
          id,
          user_id: sessionId,
          name,
          description,
          diet,
        })
        .then(() => {
          reply.status(200).send()
        })
        .catch((err) => {
          reply.status(400).send(err)
        })
    },
  )
}
