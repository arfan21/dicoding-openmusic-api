const responseSuccess = require('../../utils/responseSuccess');

/* eslint-disable no-underscore-dangle */
class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.fetchSongsHandler = this.fetchSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler =
            this.deleteSongByIdHandler.bind(this);
    }

    // postSongHandler
    async postSongHandler(req, h) {
        try {
            this._validator.validateSongPayload(req.payload);
            const { title, year, performer, genre, duration } =
                req.payload;

            const songId = await this._service.addSong({
                title,
                year,
                performer,
                genre,
                duration,
            });

            return h
                .response(
                    responseSuccess('Lagu berhasil ditambahkan', {
                        songId,
                    }),
                )
                .code(201);
        } catch (error) {
            return error;
        }
    }

    // fetch songs handler
    async fetchSongsHandler(req, h) {
        try {
            const result = await this._service.getAllSongs();
            return h
                .response(
                    responseSuccess('', {
                        songs: result,
                    }),
                )
                .code(200);
        } catch (error) {
            return error;
        }
    }

    // getSongByIdHandler
    async getSongByIdHandler(req, h) {
        try {
            const { id } = req.params;
            const result = await this._service.getSongById(id);

            return h
                .response(
                    responseSuccess('', {
                        song: result,
                    }),
                )
                .code(200);
        } catch (error) {
            return error;
        }
    }

    // edit song by id handler
    async putSongByIdHandler(req, h) {
        try {
            const { id } = req.params;
            this._validator.validateSongPayload(req.payload);
            const { title, year, performer, genre, duration } =
                req.payload;
            await this._service.editSongById(id, {
                title,
                year,
                performer,
                genre,
                duration,
            });

            return h
                .response(responseSuccess('lagu berhasil diperbarui'))
                .code(200);
        } catch (error) {
            return error;
        }
    }

    // delete song by id handler
    async deleteSongByIdHandler(req, h) {
        try {
            const { id } = req.params;
            await this._service.deleteSongById(id);

            return h
                .response(responseSuccess('lagu berhasil dihapus'))
                .code(200);
        } catch (error) {
            return error;
        }
    }
}

module.exports = SongsHandler;
