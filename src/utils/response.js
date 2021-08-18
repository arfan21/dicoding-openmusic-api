const cleanObj = require('./cleanObject');

module.exports = {
    responseError: (message) => ({
        status: 'error',
        message,
    }),
    responseFail: (message) => ({
        status: 'fail',
        message,
    }),
    responseSuccess: (message, data = {}) =>
        cleanObj({
            status: 'success',
            message,
            data,
        }),
};
