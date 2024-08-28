const { default: mongoose } = require("mongoose");


const customSchema = new mongoose.Schema({
    theme_name: {
        type: String,
        required: true,
        unique: true,
    },
    is_dark_theme: {
        type: Boolean,
        required: true,
        default: false
    },
    colors: {
        pollContainerBackgroundColor: {
            type: String,
            required: false
        },
        pollBoxBackgroundColor: String,
        pollQuestionColor: String,
        formLabelColor: String,
        pollOptionsLabelColor: String,
        voteButtonBackgroundColor: String,
        inputFieldPlaceholderColor: String,
        inputFieldColor: String,
        commentNameColor: String,
        commentTextColor: String
    },
    tag: {
        type: String,
        required: false,
        default: 'default',
        enum: ['default', 'saved']
    },
    is_active: {
        type: Boolean,
        required: false,
        default: true,
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('Theme', customSchema)