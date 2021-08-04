const Hapi = require('@hapi/hapi');
const songs = require('../api/songs');
const SongsService = require('../services/postgres/SongsService');
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

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

module.exports = httpServer;
