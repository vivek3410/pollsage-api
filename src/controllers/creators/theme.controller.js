const { handleControllerError } = require("../../../utils/helpers");
const { themeValidations } = require("../../validations/creators/theme.validations");
const Theme = require('../../models/theme.model')
const Poll = require('../../models/poll.model')

module.exports = {
    addTheme,
    getAllThemes,
}


async function addTheme(req) {
    try {
        const { error } = themeValidations.validate(req.body);
        if (error) {
            throw Error(error.details[0].message);
        }
        const { body } = req;
        const existingTheme = await Theme.findOne({
            theme_name: body.theme_name
        });
        if (existingTheme) {
            throw Error("Theme already exists")
        }
        const theme = await new Theme(body).save()
        await Poll.findByIdAndUpdate(
            req.user._id,
            {
                $push: { createdThemes: theme._id }
            }
        )
        return theme;
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function getAllThemes(req) {
    try {
        let themes = Theme.find().lean();
        let creator = await Poll.findOne({ creator: req.user._id }).lean();
        if (creator) {
            themes = themes.map((theme) => {
                if (theme._id.toString() === creator.theme.toString()) {
                    theme.tag = 'saved'
                }

                return theme
            })
        }

        return themes
    } catch (e) {
        throw handleControllerError(e)
    }
}