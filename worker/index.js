const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();


function fibo(index) {
    if (index < 2) {
        return 1;
    }

    return fibo(index - 2) + fibo(index - 1);
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fibo(parseInt(message)));
});

sub.subscribe('insert');