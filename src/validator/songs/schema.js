const Joi = require('joi');

const SongValidationSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().min(1900).max(2021).required(),
    performer: Joi.string().required(),
    genre: Joi.string(),
    duration: Joi.string(),
});

module.exports = { SongValidationSchema };
