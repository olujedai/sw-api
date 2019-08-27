import { Injectable } from '@nestjs/common';
import rp = require('request-promise-native');

@Injectable()
export class RequestService {
    async fetch(path) {
        const endpoint = process.env.SWAPI_URL || 'https://swapi.co/api';
        const options = {
            uri: `${endpoint}/${path}`,
            method: 'GET',
            // qs: queryObject,
            simple: true,
            json: true,
        };
        return rp(options);
    }
    async fetchUrl(url) {
        const options = {
            uri: url,
            method: 'GET',
            simple: true,
            json: true,
        };
        return rp(options);
    }
}