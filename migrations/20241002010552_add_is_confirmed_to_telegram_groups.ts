import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('telegram_groups', (table) => {
    table.boolean('is_confirmed').defaultTo(false);  // Add the is_confirmed column with default value false
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('telegram_groups', (table) => {
    table.dropColumn('is_confirmed');  // Remove the column if rolling back
  });
}
