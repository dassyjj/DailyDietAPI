import { it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('snacks', () => {
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

  it('must be possible to record a meal', async () => {
    await request(app.server).post('/auth/register').send({
      username: 'username_register_test',
      email: 'email_register_test',
      password: 'test123',
    })

    const loginUserResponse = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'email_register_test',
        password: 'test123',
      })

    const cookies = loginUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/snack')
      .set('Cookie', cookies)
      .send({
        name: 'Hamburguer_test',
        description: 'description_test',
        diet: true,
      })
      .expect(201)
  })

  it('should be able to list all snacks', async () => {
    await request(app.server).post('/auth/register').send({
      username: 'username_register_test',
      email: 'email_register_test',
      password: 'test123',
    })

    const loginUserResponse = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'email_register_test',
        password: 'test123',
      })

    const cookies = loginUserResponse.get('Set-Cookie')

    await request(app.server).post('/snack').set('Cookie', cookies).send({
      name: 'Hamburguer_test',
      description: 'description_test',
      diet: true,
    })

    await request(app.server).get('/snack').set('Cookie', cookies).expect(200)
  })

  it('should be able to list just one specific snack', async () => {
    await request(app.server).post('/auth/register').send({
      username: 'username_register_test',
      email: 'email_register_test',
      password: 'test123',
    })

    const loginUserResponse = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'email_register_test',
        password: 'test123',
      })

    const cookies = loginUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/snack')
      .set('Cookie', cookies)
      .send({
        name: 'Hamburguer_test',
        description: 'description_test',
        diet: true,
      })
      .expect(201)

    const listSnacksResponse = await request(app.server)
      .get('/snack')
      .set('Cookie', cookies)

    const snackId = listSnacksResponse.body.snacks[0].id

    await request(app.server)
      .get(`/snack/${snackId}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('must be able to remove a specific snack', async () => {
    await request(app.server).post('/auth/register').send({
      username: 'username_register_test',
      email: 'email_register_test',
      password: 'test123',
    })

    const loginUserResponse = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'email_register_test',
        password: 'test123',
      })

    const cookies = loginUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/snack')
      .set('Cookie', cookies)
      .send({
        name: 'Hamburguer_test',
        description: 'description_test',
        diet: true,
      })
      .expect(201)

    const listSnacksResponse = await request(app.server)
      .get('/snack')
      .set('Cookie', cookies)

    const snackId = listSnacksResponse.body.snacks[0].id

    await request(app.server)
      .delete(`/snack/${snackId}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it('it should be possible to edit a meal', async () => {
    await request(app.server).post('/auth/register').send({
      username: 'username_register_test',
      email: 'email_register_test',
      password: 'test123',
    })

    const loginUserResponse = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'email_register_test',
        password: 'test123',
      })

    const cookies = loginUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/snack')
      .set('Cookie', cookies)
      .send({
        name: 'Hamburguer_test',
        description: 'description_test',
        diet: true,
      })
      .expect(201)

    const listSnacksResponse = await request(app.server)
      .get('/snack')
      .set('Cookie', cookies)

    const snackId = listSnacksResponse.body.snacks[0].id

    await request(app.server)
      .put(`/snack/${snackId}`)
      .set('Cookie', cookies)
      .send({
        name: 'other_test',
        description: 'other_description_test',
        diet: false,
      })
      .expect(200)
  })
})
