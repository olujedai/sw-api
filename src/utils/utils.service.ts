import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    sortFunction = (key: string, order: string = 'asc') => (a, b) => {
        if (!Object.prototype.hasOwnProperty.call(a, key)
            || !Object.prototype.hasOwnProperty.call(b, key)) {
            return 0;
        }

        const valA = a[key];
        const valB = b[key];
        if ( this.isAString(valA) && this.isAString(valB) ) {
            a = valA.toUpperCase();
            b = valB.toUpperCase();
        }

        if ( this.isANumber(valA) && this.isANumber(valB) ) {
            a = Number(valA);
            b = Number(valB);
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
