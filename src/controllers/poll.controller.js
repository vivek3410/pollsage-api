const Poll = require('../models/poll.model')
const { handleControllerError, generateString } = require("../../utils/helpers");
const { pollSchema } = require("../validations/poll.validations");

const pollSchema = Joi.object({
    question: Joi.string().required(),
    options: Joi.array()
        .items(
            Joi.object({
                text: Joi.string().required(),
                votes: Joi.number().default(0),
            })
        )
        .required(),
    allow_multiple_selection: Joi.boolean().default(false),
    // creator: Joi.string().required(),
});

module.exports = {
    addPoll,
}

/*
 *  @description add poll 
 */

async function addPoll(req) {
    try {
        const { error } = pollSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message);
        }
        const { body } = req;
        body.pollId = generateString(6);
        return await new Poll(body).save();
    } catch (e) {
        throw handleControllerError(e)
    }
}

