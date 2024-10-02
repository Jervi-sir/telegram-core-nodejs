import knex from 'knex';
import knexConfig from '../../knexfile';

// Assuming the `development` environment; adjust if needed
const db = knex(knexConfig.development);

export default db;
