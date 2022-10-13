import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import Redis from 'ioredis';

export const redis: FastifyPluginCallback = fp(async function (app, _, done) {
  const client = new Redis(app.config.redisUrl);

  app.decorate('redis', {
    instance: client,
    setUserRecord: (user) => client.hmset(`User:${user.id}`, user),
    getUserRecord: (id) => client.hgetall(`User:${id}`),
    clearUserData: (id) => client.multi().del(`User:${id}`).exec(),
    ping: () => {
      if (client.status !== 'ready') {
        app.log.error({
          message: 'Redis connection is down',
          meta: {
            status: client.status,
          },
        });

        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    },
  });
  app.addHook('onClose', (app, done) => (app.log.info('closing redis instance ...'), app.redis.instance.quit(done)));
  done();
});

declare module 'fastify' {
  interface FastifyInstance {
    redis: Readonly<RedisService>;
  }
}

interface RedisService {
  instance: Readonly<Redis>;
  setUserRecord: (user: any) => Promise<string>;
  getUserRecord: (id: string) => Promise<Record<string, string>>;
  clearUserData: (id: string) => Promise<any>;
  ping: () => Promise<boolean>;
}
