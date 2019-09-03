import { Injectable } from '@nestjs/common';
import * as rp from 'request-promise-native';
import { promisify } from 'util';
import * as redis from 'redis';

/*
Provides methods that implement logic for interacting with the cache and remote APIs
*/

const redisUrl = process.env.REDIS_URL;
export const client = redis.createClient({
    url: redisUrl,
});

@Injectable()
export class RequestService {
    storeInRedis = promisify(client.set).bind(client);
    getFromRedis = promisify(client.get).bind(client);

    async fetch(path: string) {
        const endpoint = process.env.SWAPI_URL || 'https://swapi.co/api';
        const options = {
            uri: `${endpoint}/${path}`,
            method: 'GET',
            // qs: queryObject,
            simple: true,
            json: true,
        };
        return rp(options).then(
            (resp) => {
            return resp;
        })
        .catch((err) => {
            if (err.statusCode === 400) {
                return null;
            }
        });
    }

    async fetchUrl(url: string) {
        const options = {
            uri: url,
            method: 'GET',
            simple: true,
            json: true,
        };
        return rp(options).then(
            (resp) => {
            return resp;
        })
        .catch((err) => {
            return null;
        });
    }
}
