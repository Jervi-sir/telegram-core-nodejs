import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('telegram_groups', (table) => {
    table.increments('id').primary();
    table.string('group_name').notNullable();
    table.string('group_link').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('telegram_groups');
}
