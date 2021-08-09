const Hapi = require('@hapi/hapi');
const songs = require('../api/songs');
const users = require('../api/users');
const ClientError = require('../exceptions/ClientError');
const SongsService = require('../services/postgres/SongsService');
const UserService = require('../services/postgres/UsersService');
const responseError = require('../utils/responseError');
const responseFail = require('../utils/responseFail');
const SongsValidator = require('../validator/songs');
const UsersValidator = require('../validator/users');

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
    const usersService = new UserService();
    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
    ]);

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

        return response.continue || response;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

module.exports = httpServer;
