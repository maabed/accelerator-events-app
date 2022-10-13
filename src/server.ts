import fastify, { FastifyInstance } from 'fastify';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import cors from '@fastify/cors';
// import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import mercurius from 'mercurius';
import AltairFastify from 'altair-fastify-plugin';
import {
  fastifyUtils,
  health,
  exitHandler,
  errors,
  // redis,
} from './plugins';
import { apis } from './api';
import { services } from './services';
import { repos, User } from './repos';

const { ErrorWithProps } = mercurius;

export default async function build(config): Promise<FastifyInstance> {
  const server = fastify(config.serverInit);
  const ajv = new Ajv({
    allErrors: true,
    coerceTypes: true,
    useDefaults: true,
  });

  addFormats(ajv, { mode: 'fast' }).addKeyword('kind').addKeyword('modifier');

  // @ts-ignore
  server.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema);
  });

  server
    .register(exitHandler)
    .register(fastifyUtils, config)
    .register(rateLimit, {
      max: 100,
      timeWindow: '1m',
    })
    .register(sensible)
    .register(errors)
    .register(compress)
    .register(repos)
    // .register(helmet) // TODO: prevents loading altair UI, debug!
    // .register(redis)
    .register(cors, config.cors)
    .register(services)
    .register(health)
    .register(apis);

  const schema = `
    type Query {
      getEventsByUserEmail(email: String!): [Event]
    }
  
    type Event {
      id: ID!
      title: String!
      createdBy: String!
      start: String!
      end: String!
      alarm: String
      url: String
    }
  `;

  const resolvers = {
    Query: {
      getEventsByUserEmail: async (_, { email }) => {
        const user = await User.findMaybeOne({ email });
        if (!user) {
          throw new ErrorWithProps('Invalid User Email', {
            email,
            code: 'USER_EMAIL_INVALID',
            timestamp: Math.round(new Date().getTime() / 1000),
          });
        }

        const events = await User.relatedQuery('events')
          .for(User.query().where({ email }))
          .select('*')
          .execute();

        return events;
      },
    },
  };

  server.register(mercurius, {
    schema,
    resolvers,
    graphiql: false,
    ide: false,
    path: '/graphql',
    jit: 1,
  });

  server.register(AltairFastify, {
    path: '/altair',
    baseURL: '/altair/',
    endpointURL: '/graphql',
  });

  await server.ready();

  // @ts-ignore
  return server;
}
