const Joi = require("joi");
const { handleControllerError } = require("../../../utils/helpers");
const Admin = require('../../models/admin.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require("../../../config/config");

module.exports = {
    login
}

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(6)
})

async function login(req) {
    try {
        const { error } = loginSchema.validate(req.body)

        if (error) {
            throw Error(error.details[0].message)
        }

        const { username, password } = req.body;
        let emailOrUsername = username;

        const admin = await Admin.findOne({
            $or: [
                { email: emailOrUsername }, // search by email
                { username: emailOrUsername } // search by username
            ]
        })

        if (!admin) {
            throw Error('Invalid credentials')
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, name: admin.name, role: 'admin' },
            config.JWT_SECRET,
            { expiresIn: '3h' }
        )

        return { token }
    } catch (e) {
        throw handleControllerError(e)
    }
}