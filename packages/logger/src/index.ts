import pino from 'pino';

import { config } from './config';

const logger = pino(config);

const loggerWithContext = (
  context: object
): ReturnType<typeof logger.child> => {
  return logger.child({ context });
};

export { logger, loggerWithContext };
