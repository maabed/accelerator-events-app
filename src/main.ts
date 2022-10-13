import { FastifyInstance } from 'fastify';
import build from './server';
import configs from './config';
import { eventConsumer } from './consumer';

async function main() {
  const app: FastifyInstance = await build(configs);
  try {
    await app.listen({ port: configs.port || 9000, host: '0.0.0.0' });
    // setInterval(eventConsumer, 10000);
    setInterval(eventConsumer, 60 * 60 * 1000);
  } catch (error) {
    app.log.error('Server failed to start %j', error);
    app.exit(1, error);
  }
}

main();
