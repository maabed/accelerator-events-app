import { EOL } from 'os';
import pino from 'pino';

const isProd = process.env.NODE_ENV !== 'development';

const basicLoggerOpts = {
  level: process.env.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:mm-dd h:M:s.L TT',
      levelFirst: true,
      crlf: EOL === '\r\n',
      colorize: !isProd,
      ignore: 'pid,hostname,ecs,process,req.headers,request.headers.cookie,request.headers.authorization',
      singleLine: !!isProd,
      errorProps: 'payload,stack',
    },
  },
};

const logger = pino({ ...basicLoggerOpts });

export default logger;
