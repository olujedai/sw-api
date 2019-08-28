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
        [valA, valB] = this.convertToType(valA, valB);
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

    convertToType(a, b) {
        if ( Object.prototype.toString.call(a) === '[object Date]' && Object.prototype.toString.call(b) === '[object Date]') {
            a = new Date(a);
            b = new Date(b);
            return [a, b];
        }
        if ( this.isAString(a) && this.isAString(b) ) {
            a = a.toUpperCase();
            b = b.toUpperCase();
            return [a, b];
        }
        if ( this.isANumber(a) && this.isANumber(b) ) {
            a = Number(a);
            b = Number(b);
            return [a, b];
        }
        return [a, b];
    }
    getIpAddress = (request) => {
        return (request.headers['x-forwarded-for'] || '').split(',').pop() || request.connection.remoteAddress;
    }
}
