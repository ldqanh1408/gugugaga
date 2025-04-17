// cacheService.js
import client from '../configs/redisClient';

export async function setCache(key, value, ttl = 3600) {
  await client.set(key, JSON.stringify(value), { EX: ttl });
}

export async function getCache(key) {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

export async function deleteCache(key) {
  await client.del(key);
}
