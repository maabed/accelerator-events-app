import { Config } from '../config';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const fastifyUtilsPlugin: FastifyPluginCallback = function (app, config, done) {
  app.decorate('config', config);
  const registerServices: RegisterServices = function (name, services) {
    app.decorate(name, services);
    Object.values(app[name]).forEach((service: any) => service.inject(app));
  };
  app.decorate('registerServices', registerServices);
  done();
};

export const fastifyUtils = fp(fastifyUtilsPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    registerServices: RegisterServices;
    config: Readonly<Config>;
  }
}

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];

type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

type ServicesObject = Readonly<Record<string, FastifyService>>;

interface RegisterServices {
  (name: keyof SubType<FastifyInstance, ServicesObject>, services: ServicesObject): void;
}

export interface FastifyService {
  inject(app: FastifyInstance): void;
}
