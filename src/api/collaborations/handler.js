const { responseSuccess } = require('../../utils/response');

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationHandler =
            this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler =
            this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(req, h) {
        this._validator.validateCollaborationPayload(req.payload);
        const { id: credentialId } = req.auth.credentials;
        const { playlistId, userId } = req.payload;

        await this._playlistsService.verifyPlaylistsOwner(
            playlistId,
            credentialId,
        );
        const collaborationId =
            await this._collaborationsService.addCollaboration(
                playlistId,
                userId,
            );
        return h
            .response(
                responseSuccess('Kolaborasi berhasil ditambahkan', {
                    collaborationId,
                }),
            )
            .code(201);
    }

    async deleteCollaborationHandler(req, h) {
        this._validator.validateCollaborationPayload(req.payload);
        const { id: credentialId } = req.auth.credentials;
        const { playlistId, userId } = req.payload;

        await this._playlistsService.verifyPlaylistsOwner(
            playlistId,
            credentialId,
        );
        await this._collaborationsService.deleteCollaboration(
            playlistId,
            userId,
        );

        return h
            .response(responseSuccess('Kolaborasi berhasil dihapus'))
            .code(200);
    }
}

module.exports = CollaborationsHandler;
