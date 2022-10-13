import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Knex, knex } from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';
import Event from './event';
import Calender from './calender';
import User from './user';

export { Event, Calender, User };

const _repos = Object.freeze({
  Event,
  User,
  Calender,
});

const reposPlugin: FastifyPluginCallback = function (app, _, done) {
  const knexClient = knex({
    client: 'pg',
    connection: app.config.db.connectionString,
    pool: {
      max: app.config.db.max,
    },
    ...knexSnakeCaseMappers(),
    acquireConnectionTimeout: 10000,
    debug: app.config.env === 'development' && app.config.logLevel === 'trace',
  });

  Model.knex(knexClient);

  app.decorate('knex', knexClient);
  app.decorate('repos', _repos);
  app.addHook('onClose', (fastify, done) => {
    knexClient.destroy();
    done();
  });

  done();
};

export const repos = fp(reposPlugin);

declare module 'fastify' {
  export interface FastifyInstance {
    knex: Knex;
    repos: typeof _repos;
  }
}
