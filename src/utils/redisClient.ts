import { createClient, RedisClientType } from "redis";

// Create the Redis client
const redisClient: RedisClientType = createClient({
  socket: {
    host: "redis_cache",
    port: 6379,
  },
});

// Error handling
redisClient.on("error", (err: Error) => {
  console.error("Redis error:", err);
});

// Connect to Redis
redisClient.connect().catch((err) => {
  console.error("Error connecting to Redis:", err);
});

// Export the redis client
export default redisClient;
