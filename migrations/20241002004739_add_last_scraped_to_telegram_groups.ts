import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('telegram_groups', (table) => {
    table.timestamp('last_scraped').nullable();  // Add a nullable timestamp field
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('telegram_groups', (table) => {
    table.dropColumn('last_scraped');
  });
}
