const InvariantError = require('../../exceptions/InvariantError');
const { UserValidationSchema } = require('./schema');

const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult =
            UserValidationSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UsersValidator;
