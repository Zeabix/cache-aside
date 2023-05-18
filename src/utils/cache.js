const redis = require('redis');

const redisPort = process.env.REDIS_PORT || 6379
const redisHost = process.env.REDIS_HOST || 'localhost'

const client = redis.createClient(redisPort, redisHost, redis);

const connect = async () => {
    await client.connect();
    console.log(`Redis connected successfully`)
}

module.exports = {
    client,
    connect
}