const InvariantError = require('../../exceptions/InvariantError');
const { SongValidationSchema } = require('./schema');

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult =
            SongValidationSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = SongsValidator;
