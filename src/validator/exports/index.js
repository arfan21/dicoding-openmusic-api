const InvariantError = require('../../exceptions/InvariantError');
const ExportPlaylistValidationSchema = require('./schema');

const ExportsValidator = {
    validateExportPlaylistsPayload: (payload) => {
        const validationResult =
            ExportPlaylistValidationSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator;
