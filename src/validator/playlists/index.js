const InvariantError = require('../../exceptions/InvariantError');
const {
    PlaylistValidationSchema,
    PlaylistAddSongValidationSchema,
    PlaylistDeleteSongValidationSchema,
} = require('./schema');

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult =
            PlaylistValidationSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePlaylistAddSongPayload: (payload) => {
        const validationResult =
            PlaylistAddSongValidationSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePlaylistDeleteSongPayload: (payload) => {
        const validationResult =
            PlaylistDeleteSongValidationSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistsValidator;
