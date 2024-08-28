const express = require('express');
const { createError, createResponse } = require('../../../utils/helpers');
const { resStatusCode, resMsg } = require('../../../config/constants');
const adminAuthCtrl = require('../../controllers/admin/auth.controller')
const asyncHandler = require('express-async-handler')

const router = express.Router();
module.exports = router


/**
 * @route POST api/v1/admin/auth/login
 * @description admin login
 * @returns JSON
 * @access public
 */
router.post("/login", asyncHandler(login));

async function login(req, res, next) {
    try {
        let response = await adminAuthCtrl.login(req);
        if (response) return createResponse(res, resStatusCode.LOGIN, resMsg.LOGIN, response);
        else
            return createError(res, resStatusCode.BAD_REQUEST, { message: resMsg.BAD_REQUEST })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}