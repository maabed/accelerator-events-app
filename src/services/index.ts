import fp from 'fastify-plugin';
import { FastifyPluginCallback } from 'fastify';
import { EventService } from './event';

const _services = Object.freeze({
  event: new EventService(),
});

const servicesPlugin: FastifyPluginCallback = (app, _, done) => (app.registerServices('services', _services), done());

export const services = fp(servicesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    services: typeof _services;
  }
}
