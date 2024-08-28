const PollCreator = require('../models/creator.model')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const { handleControllerError } = require("../../utils/helpers");
const { registrationSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema } = require("../validations/app/auth.validations");
const sendMail = require('../../config/mail');
const { validateHeaderValue } = require('http');
const config = require('../../config/config');

module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
}


/*
 * @description add poll
 */
async function register(req) {
    try {
        const { error } = registrationSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message);
        }
        const { name, email, password } = req.body

        // check if user already exists
        const existingUser = await PollCreator.findOne({ email })
        if (existingUser) {
            throw Error('User already exists')
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = uuid.v4();

        // Create a new poll creator
        const pollCreator = new PollCreator({
            name,
            email,
            password: hashedPassword,
            verificationToken,
        })

        // save the poll creator
        await pollCreator.save();

        // send verification email
        const verificationLink = `http://localhost:3000/verify/${verificationToken}`;
        const mailOptions = {
            to: email,
            subject: "Verify Your email",
            html: `<p>Click on the following link to verify your email: ${verificationLink}</p>`
        }

        // await sendMail(mailOptions);
        return true;
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function login(req) {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message,)
        }

        const { email, password } = req.body;

        // find the poll creator by email
        const pollCreator = await PollCreator.findOne({ email });

        if (!pollCreator || !(await bcrypt.compare(password, pollCreator.password))) {
            throw Error("Invalid email or password")
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: pollCreator._id, name: pollCreator.name, role: 'creator' },
            config.JWT_SECRET,
            { expiresIn: '1d' }
        )

        return token
    } catch (e) {
        throw handleControllerError(e);
    }
}

async function forgetPassword(req) {
    try {
        let { error } = forgetPasswordSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message)
        }

        const { email } = req.body;

        const pollCreator = await PollCreator.findOne({ email });

        if (!pollCreator) {
            throw Error('User not found')
        }

        const resetToken = uuid.v4();

        pollCreator.resetPasswordToken = resetToken;
        pollCreator.resetPasswordTokenExpiration = Date.now() + 3600000 // token valid for 1 hour

        await pollCreator.save();

        console.log(pollCreator);

        const verificationLink = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            subject: 'Verify your email',
            html: `<p>Click on the following link to forget your password: ${verificationLink}</p>`,
        }
        await sendMail(mailOptions)
        return true
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function resetPassword(req) {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message)
        }

        const { token, password } = req.body;
        const pollCreator = await PollCreator.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiration: { $gt: Date.now() },
        })

        if (!pollCreator) {
            throw Error('Invalid or expired reset token')
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the users password and reset token
        pollCreator.password = hashedPassword;
        pollCreator.resetPasswordToken = undefined;
        pollCreator.resetPasswordTokenExpiration = undefined;
        await pollCreator.save();

        return true
    } catch (e) {
        throw handleControllerError(e)
    }
}