const Joi = require('joi');

const CollaborationValidationdSchema = Joi.object({
    playlistId: Joi.string().length(26).required(),
    userId: Joi.string().length(21).required(),
});

module.exports = { CollaborationValidationdSchema };
