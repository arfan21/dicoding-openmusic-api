const { responseSuccess } = require('../../utils/response');

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylist = this.postPlaylist.bind(this);
        this.getPlaylistByOwner = this.getPlaylistByOwner.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.postPlaylistsSong = this.postPlaylistsSong.bind(this);
        this.getSongsFromPlaylistsByPlaylistId =
            this.getSongsFromPlaylistsByPlaylistId.bind(this);
        this.deleteSongFromPlaylistsBySongIdAndPlaylistId =
            this.deleteSongFromPlaylistsBySongIdAndPlaylistId.bind(
                this,
            );
    }

    async postPlaylist(req, h) {
        this._validator.validatePlaylistPayload(req.payload);
        const { id: owner } = req.auth.credentials;
        const { name } = req.payload;

        const playlistId = await this._service.addPlaylist({
            name,
            owner,
        });

        return h
            .response(
                responseSuccess('Playlist berhasil ditambahkan', {
                    playlistId,
                }),
            )
            .code(201);
    }

    async getPlaylistByOwner(req, h) {
        const { id: owner } = req.auth.credentials;
        const result = await this._service.getPlaylistsByOwner(owner);
        return h
            .response(
                responseSuccess('', {
                    playlists: result,
                }),
            )
            .code(200);
    }

    async deletePlaylist(req, h) {
        const { playlistId } = req.params;
        const { id: owner } = req.auth.credentials;

        await this._service.verifyPlaylistsOwner(playlistId, owner);
        await this._service.deletePlaylists(playlistId);

        return h
            .response(responseSuccess('Playlist berhasil dihapus'))
            .code(200);
    }

    async postPlaylistsSong(req, h) {
        this._validator.validatePlaylistAddSongPayload(req.payload);
        const { playlistId } = req.params;
        const { id: owner } = req.auth.credentials;

        const { songId } = req.payload;

        await this._service.verifyPlaylistsAcess(playlistId, owner);
        await this._service.addPlaylistsSong({ playlistId, songId });

        return h
            .response(
                responseSuccess(
                    'Lagu berhasil ditambahkan ke playlist',
                ),
            )
            .code(201);
    }

    async getSongsFromPlaylistsByPlaylistId(req, h) {
        const { playlistId } = req.params;
        const { id: owner } = req.auth.credentials;

        await this._service.verifyPlaylistsAcess(playlistId, owner);
        const result =
            await this._service.getSongsFromPlaylistsByPlaylistId(
                playlistId,
            );

        return h
            .response(
                responseSuccess('', {
                    songs: result,
                }),
            )
            .code(200);
    }

    async deleteSongFromPlaylistsBySongIdAndPlaylistId(req, h) {
        this._validator.validatePlaylistAddSongPayload(req.payload);
        const { playlistId } = req.params;
        const { id: owner } = req.auth.credentials;

        const { songId } = req.payload;

        await this._service.verifyPlaylistsAcess(playlistId, owner);
        await this._service.deleteSongFromPlaylistsBySongIdAndPlaylistId(
            songId,
            playlistId,
        );

        return h
            .response(
                responseSuccess(
                    'Lagu berhasil dihapus dari playlist',
                ),
            )
            .code(200);
    }
}

module.exports = PlaylistsHandler;
