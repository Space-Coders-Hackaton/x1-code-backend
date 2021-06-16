import { LIMITER } from '@config/env';
import { Request, Response } from 'express';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import redis from 'redis';

import { HttpStatus } from '@shared/web/HttpStatus';
import { HttpStatusError } from '@shared/errors/HttpStatusError';
import { Service } from 'typedi';

const redisClient =
  process.env.LIMITER === 'Redis' &&
  redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS || undefined,
  });

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'redis',
  points: 16,
  duration: 60 * 60 * 1, // Store number for three hours since first fail
  blockDuration: 60 * 1, // Block for 15 minutes
});

const opts = {
  points: 16, // 6 points
  duration: 60 * 60 * 1, // Per second
  blockDuration: 60 * 1, // Block for 1 minutes
  msBeforeNext: 250, // Number of milliseconds before next action can be done
  remainingPoints: 16, // Number of remaining points in current duration
  consumedPoints: 16, // Number of consumed points in current duration
  isFirstInDuration: false, // action is first in current duration
  setTimeout: 60 * 60 * 1,
  keyPrefix: 'localMemory',
};

const rateLimiter = new RateLimiterMemory(opts);

@Service()
@Middleware({ type: 'before' })
export class GlobalRateLimit implements ExpressMiddlewareInterface {
  async use(request: Request, response: Response, next: (err?: any) => any): Promise<void> {
    if (!request.url.includes('/api-docs/')) {
      try {
        if (LIMITER === 'Memory') await rateLimiter.consume(request.ip);
        if (LIMITER === 'Redis') await limiter.consume(request.ip);
        return next();
      } catch (err) {
        throw new HttpStatusError(HttpStatus.TOO_MANY_REQUESTS, 'Access blocked for a period of time.');
      }
    }
    return next();
  }
}
