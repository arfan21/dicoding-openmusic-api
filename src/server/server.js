const Hapi = require('@hapi/hapi');
const songs = require('../api/songs');
const ClientError = require('../exceptions/ClientError');
const SongsService = require('../services/postgres/SongsService');
const responseError = require('../utils/responseError');
const responseFail = require('../utils/responseFail');
const songsValidator = require('../validator');

const httpServer = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const songsService = new SongsService();
    await server.register({
        plugin: songs,
        options: {
            service: songsService,
            validator: songsValidator,
        },
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof ClientError) {
            return h
                .response(responseFail(response.message))
                .code(response.statusCode);
        }
        if (response instanceof Error) {
            return h
                .response(responseError('internal server error'))
                .code(500);
        }

        // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return response.continue || response;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

module.exports = httpServer;
