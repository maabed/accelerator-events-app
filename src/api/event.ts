import { FastifyPluginCallback, FastifyRequest } from 'fastify';
import { EventSchema } from '../schemas';

const eventControllers: FastifyPluginCallback = function (app, _, done) {
  app.get(
    '/events/:email',
    {
      schema: EventSchema.listEvents,
    },
    async (
      req: FastifyRequest<{ Params: { email: string }; Querystring: { page?: number; size?: number } }>,
      reply,
    ) => {
      const { email } = req.params;
      const { page, size } = req.query;
      const results = await app.services.event.generate({ email, page, size });
      return reply.status(200).send(results);
    },
  );
  done();
};

export default eventControllers;
