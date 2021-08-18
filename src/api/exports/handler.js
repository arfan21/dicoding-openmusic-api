const { responseSuccess } = require('../../utils/response');

class ExportsHandler {
    constructor(producerService, playlistsService, validator) {
        this._validator = validator;
        this._producerService = producerService;
        this._playlistsService = playlistsService;

        this.postExportPlaylistsHandler =
            this.postExportPlaylistsHandler.bind(this);
    }

    async postExportPlaylistsHandler(req, h) {
        const { playlistId } = req.params;
        this._validator.validateExportPlaylistsPayload(req.payload);

        const message = {
            userId: req.auth.credentials.id,
            targetEmail: req.payload.targetEmail,
        };

        await this._playlistsService.verifyPlaylistsAcess(
            playlistId,
            message.userId,
        );

        await this._producerService.sendMessage(
            'exports:playlists',
            JSON.stringify(message),
        );

        return h
            .response(
                responseSuccess('Permintaan Anda dalam antrean'),
            )
            .code(201);
    }
}

module.exports = ExportsHandler;
