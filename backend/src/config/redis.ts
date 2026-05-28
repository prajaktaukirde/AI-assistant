import IORedis, { RedisOptions } from 'ioredis';
import { env } from './env';

// Parse URL into options so BullMQ + ioredis use a consistent type.
function parseRedisOptions(url: string): RedisOptions {
  const u = new URL(url);
  const tls = u.protocol === 'rediss:';
  return {
    host: u.hostname,
    port: Number(u.port || 6379),
    username: u.username || undefined,
    password: u.password ? decodeURIComponent(u.password) : undefined,
    db: u.pathname && u.pathname.length > 1 ? Number(u.pathname.slice(1)) : 0,
    tls: tls ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}

export const redisOptions = parseRedisOptions(env.redisUrl);

export function makeRedis() {
  return new IORedis(redisOptions);
}
