const Hapi = require('@hapi/hapi');
const hapiAuthJwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const authentications = require('../api/authentications');
const collaborations = require('../api/collaborations');
const _exports = require('../api/exports');
const playlists = require('../api/playlists');
const songs = require('../api/songs');
const users = require('../api/users');
const uploads = require('../api/uploads');
const ClientError = require('../exceptions/ClientError');
const AuthenticationsService = require('../services/postgres/AuthenticationsService');
const CollaborationsService = require('../services/postgres/CollborationsService');
const PlaylistsService = require('../services/postgres/PlaylistsService');
const SongsService = require('../services/postgres/SongsService');
const UserService = require('../services/postgres/UsersService');
const TokenManager = require('../token/tokenManager');
const AuthenticationsValidator = require('../validator/authentications');
const CollaborationsValidator = require('../validator/collaborations');
const ExportsValidator = require('../validator/exports');
const PlaylistsValidator = require('../validator/playlists');
const SongsValidator = require('../validator/songs');
const UsersValidator = require('../validator/users');
const ProducerService = require('../services/rabbitmq/ProducerService');
const { responseFail, responseError } = require('../utils/response');
const StorageService = require('../services/storage/StorageService');
const UploadsValidator = require('../validator/uploads');
const CacheService = require('../services/redis/CacheService');

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

    await server.register([
        {
            plugin: hapiAuthJwt,
        },
        {
            plugin: Inert,
        },
    ]);

    server.auth.strategy('openmusicapi_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.userId,
            },
        }),
    });

    const cacheService = new CacheService();
    const songsService = new SongsService(cacheService);
    const usersService = new UserService();
    const authenticationsService = new AuthenticationsService(
        cacheService,
    );
    const collaborationsService = new CollaborationsService(
        cacheService,
    );
    const playlistsService = new PlaylistsService(
        collaborationsService,
        cacheService,
    );

    const storageService = new StorageService(
        path.resolve(__dirname, '../api/uploads/files/pictures'),
    );
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
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                producerService: ProducerService,
                playlistsService,
                validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
                service: storageService,
                validator: UploadsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof ClientError)
            return h
                .response(responseFail(response.message))
                .code(response.statusCode);

        if (
            response?.output?.statusCode >= 400 ||
            response?.output?.statusCode < 500
        )
            return h
                .response(
                    responseFail(response.output.payload.message),
                )
                .code(response.output.payload.statusCode);

        if (response instanceof Error)
            return h
                .response(responseError('internal server error'))
                .code(500);

        return response.continue || response;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

module.exports = httpServer;
