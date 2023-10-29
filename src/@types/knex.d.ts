import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      username: string
      email: string
      password: string
      created_at: string
    }
    snacks: {
      id: string
      user_id: string
      name: string
      description: string
      diet: boolean
      created_at: string
    }
  }
}
