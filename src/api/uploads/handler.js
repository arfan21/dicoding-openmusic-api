const { responseSuccess } = require('../../utils/response');

class UploadsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUploadPictureHandler =
            this.postUploadPictureHandler.bind(this);
    }

    async postUploadPictureHandler(req, h) {
        const { data } = req.payload;
        this._validator.validatePictureHeaders(data.hapi.headers);

        const filename = await this._service.writeFile(
            data,
            data.hapi,
        );

        return h
            .response(
                responseSuccess('', {
                    pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
                }),
            )
            .code(201);
    }
}

module.exports = UploadsHandler;
