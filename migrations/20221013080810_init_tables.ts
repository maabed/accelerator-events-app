import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('user', (table) => {
      table.uuid('id').primary();
      table.string('username').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('first_name');
      table.string('last_name');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('calender', (table) => {
      table.uuid('id').primary();
      table.uuid('owner')
        .notNullable()
        .references('user.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('timezone').defaultTo('Asia/Amman').notNullable();
      table.string('description');
      table.string('color').defaultTo('#FFFFFF');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('event', (table) => {
      table.uuid('id').primary();
      table.uuid('cal_id')
        .notNullable()
        .references('calender.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('title').notNullable();
      table.uuid('created_by').notNullable()
        .references('user.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.bigint('start').notNullable();
      table.bigint('end').notNullable();
      table.boolean('alarm').defaultTo(true).notNullable();
      table.string('duration');
      table.string('url');
      table.jsonb('attendees');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable('user')
    .dropTable('calender')
    .dropTable('event');
}
