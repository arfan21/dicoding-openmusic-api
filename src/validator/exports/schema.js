const Joi = require('joi');

const ExportPlaylistValidationSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlaylistValidationSchema;
