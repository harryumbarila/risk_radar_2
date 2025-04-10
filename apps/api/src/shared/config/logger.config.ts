import { RequestMethod } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Params } from 'nestjs-pino/params';

export const loggerConfig = {
  pinoHttp: {
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    // Define a custom request id function
    genReqId(req, res) {
      const existingID = req.id ?? req.headers['x-request-id'];
      if (existingID) return existingID;
      const id = randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
    transport:
      // eslint-disable-next-line no-restricted-properties
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          }
        : undefined,
    customLogLevel: (res, err) => {
      if (
        // eslint-disable-next-line no-restricted-properties
        process.env.NODE_ENV === 'production' &&
        (res.statusCode === 404 || err.statusCode === 404)
      ) {
        return 'silent'; // Skip logging for 404
      }

      if (err && err.statusCode >= 400 && err.statusCode < 500) {
        return 'warn';
      }

      if (err && err.statusCode >= 500) {
        return 'error';
      }

      if (res.statusCode >= 500) {
        return 'error';
      }

      if (res.statusCode >= 400) {
        return 'warn';
      }

      return 'info';
    },
  },
  exclude: [{ path: '/', method: RequestMethod.GET }],
} as Params;
