import Boom from '@hapi/boom';
import { FastifyError, FastifyPluginCallback, FastifyRequest, HTTPMethods } from 'fastify';
import fp from 'fastify-plugin';

const errorsPluginCallback: FastifyPluginCallback = function (app, _, done) {
  const routeMethods: Record<string, Set<HTTPMethods>> = {};

  app.decorate('errors', Boom);
  app.addHook(
    'onRoute',
    ({ path, method }) => (
      routeMethods[path]
        ? new Array<HTTPMethods>().concat(method).forEach((method) => routeMethods[path].add(method))
        : (routeMethods[path] = new Set(([] as HTTPMethods[]).concat(method))),
      void 0
    ),
  );
  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit({
        max: 4,
        timeWindow: 500,
      }),
    },
    (request, reply) => {
      if (routeMethods[request.url] && !routeMethods[request.url].has(request.method as HTTPMethods)) {
        reply.status(405).send('Method Not Allowed');
      } else {
        reply.status(404).send('Not Found');
      }
    },
  );

  app.setErrorHandler(function (error, req, res) {
    if (res.statusCode === 429) {
      res.status(429).send('Slow down there kiddo!');
    } else if (Boom.isBoom(error)) {
      res
        .status(error.output.payload.statusCode)
        .send({
          message: error.output.payload.message,
        })
        .log.error({
          error: { stack: error.stack, ...error.output },
          request: formatRequest(req),
        });
    } else if (error.validation) {
      res.status(422).send({
        message: error.validation[0]?.message,
      });
    } else if (error.statusCode === 413) {
      res
        .status(413)
        .send({
          message: 'Request file too large',
        })
        .log.error(
          {
            error: formatError(error),
            request: formatRequest(req),
          },
          'uploading file error',
        );
    } else {
      res
        .status(500)
        .send({
          message: 'Internal Server Error',
        })
        .log.error(
          {
            error: formatError(error),
            request: formatRequest(req),
          },
          'internal server error',
        );
    }
  });

  done();
};

export const errors = fp(errorsPluginCallback);

const formatError = ({ code, statusCode, message, name, stack }: FastifyError) => ({
  name,
  message,
  code,
  statusCode,
  stack,
});

const formatRequest = ({
  id,
  body,
  query,
  method,
  headers: { authorization: _authorization, ...headers },
  url,
  hostname,
  ip,
}: FastifyRequest) => ({
  id,
  hostname,
  ip,
  headers,
  body,
  query,
  method,
  url,
});

declare module 'fastify' {
  interface FastifyInstance {
    errors: typeof Boom;
  }
}
