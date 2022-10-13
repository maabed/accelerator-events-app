import { FastifyInstance } from 'fastify';
import { FastifyService } from '../plugins/fastifyUtil';

export abstract class AbstractService implements FastifyService {
  protected config!: FastifyInstance['config'];
  protected repos!: FastifyInstance['repos'];
  protected db!: FastifyInstance['knex'];
  protected errors!: FastifyInstance['errors'];
  protected log!: FastifyInstance['log'];
  protected services!: FastifyInstance['services'];
  protected redis!: FastifyInstance['redis'];

  inject({ config, repos, knex, log, services, errors, redis }: FastifyInstance) {
    this.config = config;
    this.repos = repos;
    this.db = knex;
    this.services = services;
    this.errors = errors;
    this.redis = redis;
    this.log = log.child({ service: this.constructor.name });
  }
}
