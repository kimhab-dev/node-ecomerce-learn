const joi = require('joi');

const registerUserScema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().min(3).required(),
    password: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
        .message('Password must be 8-30 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.')
});

module.exports = { registerUserScema }