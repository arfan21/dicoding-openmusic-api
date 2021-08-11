const Joi = require('joi');

const PlaylistValidationSchema = Joi.object({
    name: Joi.string().required(),
});

const PlaylistAddSongValidationSchema = Joi.object({
    songId: Joi.string().required(),
});

const PlaylistDeleteSongValidationSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = {
    PlaylistValidationSchema,
    PlaylistAddSongValidationSchema,
    PlaylistDeleteSongValidationSchema,
};
