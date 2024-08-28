const Joi = require("joi");

const themeValidations = Joi.object({
    theme_name: Joi.string().required(),
    is_dark_theme: Joi.boolean().default(false),
    colors: Joi.object({
        pollContainerBackgroundColor: Joi.string().optional().allow(null),
        pollBoxBackgroundColor: Joi.string().optional().allow(null),
        pollQuestionColor: Joi.string().optional().allow(null),
        formLabelColor: Joi.string().optional().allow(null),
        pollOptionsInputColor: Joi.string().optional().allow(null),
        pollOptionsCheckedColor: Joi.string().optional().allow(null),
        inputFiledColor: Joi.string().optional().allow(null),
        pollOptionsLabelColor: Joi.string().optional().allow(null),
        voteButtonBackgroundColor: Joi.string().optional().allow(null),
        inputFieldPlaceholderColor: Joi.string().optional().allow(null),
        inputFieldColor: Joi.string().optional().allow(null),
        commentNameColor: Joi.string().optional().allow(null),
        commentTextColor: Joi.string().optional().allow(null),
    }).optional().allow(null),
    // is_active: Joi.boolean().required()
})

module.exports = {
    themeValidations
}