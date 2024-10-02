import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'jervi175',
      database: 'telegram'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true,
  },
};

export default config;
