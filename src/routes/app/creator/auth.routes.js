const express = require('express')
const asyncHandler = require('express-async-handler');
const { createError, createResponse } = require('../../../../utils/helpers');
const { resStatusCode, resMsg } = require('../../../../config/constants');
const authCtrl = require('../../../controllers/auth.controller')
const router = express.Router();

module.exports = router;


/**
 * @route POST api/v1/creators/auth/register
 * @description register
 * @returns JSON
 * @access public
 */

router.post('/register', asyncHandler(register));

/**
 * @route POST api/v1/creators/auth/login
 * @description login
 * @returns JSON
 * @access public
 */

router.post('/login', asyncHandler(login));

/**
 * @route POST api/v1/creators/auth/forget-password
 * @description forget password
 * @returns JSON
 * @access public
 */

router.post('/forget-password', asyncHandler(forgetPassword));

/**
 * @route POST api/v1/creators/auth/reset-password
 * @description reset password
 * @returns JSON
 * @access public
 */

router.post('/reset-password', asyncHandler(resetPassword));


async function register(req, res, next) {
    try {
        let response = await authCtrl.register(req);
        if (response) return createResponse(res, resStatusCode.CREATED, resMsg.CREATED, response);
        else
            return createError(res, resStatusCode.UNABLE_CREATE, { message: resMsg.UNABLE_CREATE })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}


async function login(req, res, next) {
    try {
        let response = await authCtrl.login(req);
        if (response) return createResponse(res, resStatusCode.LOGIN, resMsg.LOGIN, response);
        else
            return createError(res, resStatusCode.BAD_REQUEST, { message: resMsg.BAD_REQUEST })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function forgetPassword(req, res, next) {
    try {
        let response = await authCtrl.forgetPassword(req);
        if (response) return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
        else
            return createError(res, resStatusCode.BAD_REQUEST, { message: resMsg.BAD_REQUEST })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function resetPassword(req, res, next) {
    try {
        let response = await authCtrl.resetPassword(req);
        if (response) return createResponse(res, resStatusCode.SUCCESS, resMsg.SUCCESS, response);
        else
            return createError(res, resStatusCode.BAD_REQUEST, { message: resMsg.BAD_REQUEST })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}




