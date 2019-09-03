import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    sortFunction = (key: string, order: string = 'asc') => (a, b): number => {
        /**
         * Method used for sorting an array of objects by the compareFunction array sort function.
         * @param key the property in the object to be used for sorting
         * @param order the order in which the objects will be sorted
         * @param a the first object to be compared
         * @param b the second object to be compared
         */
        if (!Object.prototype.hasOwnProperty.call(a, key)
            || !Object.prototype.hasOwnProperty.call(b, key)) {
            return 0;
        }

        let valA = a[key];
        let valB = b[key];
        if (this.isAString(valA)) {
            valA = valA.toUpperCase();
        }

        if (this.isAString(valB)) {
            valB = valB.toUpperCase();
        }

        if (this.isANumber(valA)) {
            valA = Number(valA);
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
        return (order.toLowerCase() === 'desc') ? (comparison * -1) : comparison;
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
