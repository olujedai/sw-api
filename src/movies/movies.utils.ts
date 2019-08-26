const isANumber = (a) => {
    return typeof Number(a) === 'number';
};

export const sortFunction = (key: string, order: string = 'asc') => (a, b) => {
    if (!Object.prototype.hasOwnProperty.call(a, key)
        || !Object.prototype.hasOwnProperty.call(b, key)) {
        return 0;
    }

    a = a[key];
    b = b[key];

    if (isANumber(a)) {
        a = Number(a);
    }

    if (isANumber(b)) {
        b = Number(b);
    }

    let comparison = 0;
    if (a > b) {
        comparison = 1;
    } else if (a < b) {
        comparison = -1;
    }
    return (
        (order.toLowerCase() === 'desc') ? (comparison * -1) : comparison
    );
};
