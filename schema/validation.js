const Joi = require('joi');

// Validate user input for registration
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

// Validate user input for login
const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
