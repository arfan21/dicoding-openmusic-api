const ClientError = require('../../exceptions/ClientError');
const responseError = require('../../utils/responseError');
const responseFail = require('../../utils/responseFail');
const responseSuccess = require('../../utils/responseSuccess');

/* eslint-disable no-underscore-dangle */
class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
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
}

module.exports = SongsHandler;
