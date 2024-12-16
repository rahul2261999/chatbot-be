import { createClient, RedisClientType } from "redis";
import constant from "../constants/constant";

class Redis {
  public static instance: Redis;
  private redisClient: RedisClientType;

  private constructor() {
    this.redisClient = createClient({ url: constant.redis.url });

    this.redisClient.connect()

    this.redisClient.on('connect', () => {
      console.log('Redis publisher connected');
    });

    this.redisClient.on('error', (error) => {
      console.error('error in subscriber while connecting to Redis:', error);
    });
  };

  public static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  public getClient(): RedisClientType {
    return this.redisClient;
  }
}

export default Redis.getInstance();