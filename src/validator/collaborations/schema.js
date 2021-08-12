const Joi = require('joi');

const CollaborationValidationdSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
});

module.exports = { CollaborationValidationdSchema };
