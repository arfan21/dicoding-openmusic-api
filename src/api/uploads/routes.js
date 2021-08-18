const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/pictures',
        handler: handler.postUploadPictureHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 500000, // 500KB
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/pictures/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'files'),
            },
        },
    },
];

module.exports = routes;