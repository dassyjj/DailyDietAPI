import { it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Authentication', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('must be possible to register a user', async () => {
    await request(app.server)
      .post('/auth/register')
      .send({
        username: 'username_register_test',
        email: 'email_register_test',
        password: 'test123',
      })
      .expect(201)
  })

  it('must be possible to login a user', async () => {
    await request(app.server)
      .post('/auth/register')
      .send({
        username: 'username_register_test',
        email: 'email_register_test',
        password: 'test123',
      })
      .expect(201)

    await request(app.server)
      .post('/auth/login')
      .send({
        email: 'email_register_test',
        password: 'test123',
      })
      .expect(200)
  })
})
