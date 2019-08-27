import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    sortFunction = (key: string, order: string = 'asc') => (a, b) => {
        if (!Object.prototype.hasOwnProperty.call(a, key)
            || !Object.prototype.hasOwnProperty.call(b, key)) {
            return 0;
        }

        let valA = a[key];
        let valB = b[key];
        valA = this.isAString(valA) ? valA.toUpperCase() : valA;
        valB = this.isAString(valB) ? valB.toUpperCase() : valB;

        if (this.isANumber(valA)) {
            valA = Number(Object.assign('', valA));
        }

        if (this.isANumber(valB)) {
            valB = Number(valB);
        }

        let comparison = 0;
        if (valA > valB) {
            comparison = 1;
        } else if (valA < valB) {
            comparison = -1;
        }
        return (
            (order.toLowerCase() === 'desc') ? (comparison * -1) : comparison
        );
    }

    isAString = (a) => {
        return typeof a === 'string';
    }

    isANumber = (a) => {
        return !Number.isNaN(Number(a));
    }

    getIpAddress = (request) => {
        return (request.headers['x-forwarded-for'] || '').split(',').pop() || request.connection.remoteAddress;
    }
}
