import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('telegram_sessions', (table) => {
    table.increments('id').primary();
    table.text('session').notNullable();  // Store the session string
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('telegram_sessions');
}
