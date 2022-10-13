/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FastifyServerOptions } from 'fastify';
import envSchema from 'env-schema';
import S from 'fluent-json-schema';
import helmet from '@fastify/helmet';
import { FastifyCorsOptions } from '@fastify/cors';
import { PoolConfig } from 'pg';
import logger from './log';

export const whitelist: any = [
  /(http(s)?:\/\/)?(.+\.)?mabed\.io(\/)?(:\d{1,5})?$/,
];

type corsCallback = (err: Error | null, options: FastifyCorsOptions) => void;

type FastifyHelmetOptions = Parameters<typeof helmet>[0];

export function getConfig() {
  const env = envSchema({
    dotenv: true,
    schema: S.object()
      .prop('NODE_ENV', S.string().default('development'))
      .prop('LOG_LEVEL', S.string().default('info'))
      .prop('PORT', S.number().default(9000))
      .prop('BASE_URL', S.string().default('http://localhost:9000'))
      .prop('DOMAIN', S.string().default('localhost'))
      .prop('DATABASE_URL', S.string())
      .prop('MAX_CONN', S.number()),
  });

  const isProd: boolean = env.NODE_ENV !== 'development';

  if (env.NODE_ENV === 'development') {
    whitelist.push('localhost');
  }

  const config = {
    isProd: isProd as boolean,
    env: env.NODE_ENV as string,
    port: +env.PORT as number,
    baseUrl: env.BASE_URL as string,
    logLevel: env.LOG_LEVEL as string,
    serverInit: {
      ignoreTrailingSlash: true,
      disableRequestLogging: isProd,
      trustProxy: isProd,
      logger: logger,
      http2: false,
      keepAliveTimeout: 650 * 1000,
    } as Partial<FastifyServerOptions>,
    db: {
      max: +env.MAX_CONN,
      connectionString: env.DATABASE_URL,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    } as Partial<PoolConfig>,
    cors: {
      origin: (origin: string, cb: corsCallback): void => {
        if (!origin || whitelist.some((domain) => origin.match(domain))) {
          //  Request from localhost will pass
          cb(null, { origin: true });
          return;
        }
        cb(new Error('Not Allowed By Cors'), { origin: false });
      },
      preflight: true,
      preflightContinue: true,
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    } as Partial<FastifyCorsOptions>,
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          fontSrc: ["'self'"],
          frameAncestors: ["'none'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
          objectSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          scriptSrcAttr: ["'self'"],
          styleSrc: ["'self'"],
          formAction: ["'self'"],
        },
      },
      hsts: {
        maxAge: 60 * 60 * 24 * 365, // 1 year to get preload approval
        preload: true,
        includeSubDomains: true,
      },
      frameguard: {
        action: 'sameorigin',
      },
      referrerPolicy: {
        policy: 'no-referrer',
      },
    } as Partial<FastifyHelmetOptions>,
  };

  return config;
}

const configs = getConfig()
export default configs

export interface Config {
  isProd: boolean;
  env: string;
  port: number;
  baseUrl: string;
  logLevel: string;
  serverInit: FastifyServerOptions;
  db: PoolConfig;
  cors: FastifyCorsOptions;
  helmet: Partial<FastifyHelmetOptions>;
}
