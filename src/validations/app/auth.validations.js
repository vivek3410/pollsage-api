const Joi = require('joi')

exports.registrationSchema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
})

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

exports.forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})

exports.resetPasswordSchema = Joi.object({
    token: Joi.string().required().label("token"),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
});