const cleanObj = require('./cleanObject');

module.exports = (message, data = {}) =>
    cleanObj({
        status: 'success',
        message,
        data,
    });
