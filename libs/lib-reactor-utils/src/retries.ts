import { getUtilsLogger } from './logging';

const logger = getUtilsLogger('Retries');

export const retryWithBackoff = async <T>(
  handler: () => Promise<T>,
  attempts: number = 10,
  hint?: string
): Promise<T> => {
  const INIT_BACKOFF = 500;
  const MULTIPLIER = 0.5;

  const executeWithAttempt = async (attempt: number = 1, current_backoff: number = INIT_BACKOFF) => {
    try {
      return await handler();
    } catch (err) {
      if (hint && attempt < attempts) {
        logger.debug(`${hint} failed on attempt ${attempt}`, err);
      }

      if (attempt >= attempts) {
        if (hint) {
          logger.error(`${hint} failed after ${attempts} attempts`, err);
        }
        throw err;
      }

      const backoff = Math.floor(current_backoff + current_backoff * MULTIPLIER);
      await new Promise((resolve) => {
        setTimeout(resolve, backoff);
      });

      return executeWithAttempt(attempt + 1, backoff);
    }
  };

  return executeWithAttempt();
};
