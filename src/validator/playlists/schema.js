const Joi = require('joi');

const PlaylistValidationSchema = Joi.object({
    name: Joi.string().required(),
});

const PlaylistAddSongValidationSchema = Joi.object({
    songId: Joi.string().length(21).required(),
});

const PlaylistDeleteSongValidationSchema = Joi.object({
    songId: Joi.string().length(21).required(),
});

module.exports = {
    PlaylistValidationSchema,
    PlaylistAddSongValidationSchema,
    PlaylistDeleteSongValidationSchema,
};
