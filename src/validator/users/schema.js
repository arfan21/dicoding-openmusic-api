const Joi = require('joi');

const UserValidationSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    fullname: Joi.string().required(),
});

module.exports = { UserValidationSchema };
