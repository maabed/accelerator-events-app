import { FastifyPluginCallback } from 'fastify';
import { uptime } from 'process';
import fp from 'fastify-plugin';

const healthPlugin: FastifyPluginCallback = function (app, _, done) {
  app.get('/ping', {}, async () => {
    const t0 = +new Date();
    const dbCheck = await app.knex.raw('select 1 + 1');
    console.assert(dbCheck.rowCount === 1, 'Invalid database check.');
    const t1 = +new Date();

    const response = {
      status: 'ok',
      dbLatencyInMs: t1 - t0,
      uptime: secondsToTime(uptime()),
      serverTs: new Date().toJSON(),
    };

    return JSON.stringify(response, null, 2);
  });
  done();
};

export const health = fp(healthPlugin);

function secondsToTime(s) {
  const hour = Math.floor(s / 3600)
    .toString()
    .padStart(2, '0');
  const min = Math.floor((s % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');

  return hour + ':' + min + ':' + sec;
}
