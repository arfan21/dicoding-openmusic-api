const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const responseError = require('../../utils/responseError');
const responseFail = require('../../utils/responseFail');
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
            if (error instanceof ClientError)
                return h
                    .response(responseFail(error.message))
                    .code(400);
            return h
                .response(responseError('internal server error'))
                .code(500);
        }
    }

    // fetch songs handler
    async fetchSongsHandler(req, h) {
        const result = await this._service.getAllSongs();
        return h
            .response(
                responseSuccess('', {
                    songs: result,
                }),
            )
            .code(200);
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
            if (error instanceof NotFoundError)
                return h
                    .response(responseFail(error.message))
                    .code(error.statusCode);
            return h
                .response(responseError('internal server error'))
                .code(500);
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
            if (error instanceof NotFoundError)
                return h
                    .response(responseFail(error.message))
                    .code(error.statusCode);
            if (error instanceof ClientError)
                return h
                    .response(responseFail(error.message))
                    .code(400);

            return h
                .response(responseError('internal server error'))
                .code(500);
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
            if (error instanceof NotFoundError)
                return h
                    .response(responseFail(error.message))
                    .code(error.statusCode);
            if (error instanceof ClientError)
                return h
                    .response(responseFail(error.message))
                    .code(400);

            return h
                .response(responseError('internal server error'))
                .code(500);
        }
    }
}

module.exports = SongsHandler;
