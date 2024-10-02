import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('telegram_messages', (table) => {
    table.increments('id').primary();
    table.text('message').notNullable();
    table.string('image_url').nullable();
    table.integer('group_id').unsigned().references('id').inTable('telegram_groups').onDelete('CASCADE');
    table.string('message_link').notNullable();
    table.timestamp('sent_at').notNullable();
    table.integer('nb_views').defaultTo(0);
    table.integer('nb_likes').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('telegram_messages');
}
