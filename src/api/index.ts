import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import event from './event';

const apiPlugin: FastifyPluginCallback = function (app, _, done) {
  app.register(event, { prefix: '/api/v1' });
  done();
};

export const apis = fp(apiPlugin);
