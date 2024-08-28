
const express = require('express')
const asyncHandler = require('express-async-handler');
const { createError, createResponse } = require('../../../../utils/helpers');
const { resStatusCode, resMsg } = require('../../../../config/constants');
const themeCtrl = require('../../../controllers/creators/theme.controller')

const router = express.Router();

module.exports = router;

/*
 * @route POST api/app/v1/creators/themes
 * @description add theme
 * @return JSON
 * @access private
 */

router.post('/', asyncHandler(addTheme))

/*
 * @route GET api/app/v1/creators/themes/for-form
 * @description get all themes
 * @return JSON
 * @access private
 */

router.get('/for-form', asyncHandler(getAllThemes))

async function addTheme(req, res, next) {
    try {
        let response = await themeCtrl.addTheme(req);
        console.log(response);
        if (response) return createResponse(res, resStatusCode.CREATED, resMsg.CREATED, response);
        else
            return createError(res, resStatusCode.UNABLE_CREATE, { message: resMsg.UNABLE_CREATE })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function getAllThemes(req, res, next) {
    try {
        let response = await themeCtrl.getAllThemes(req);
        if (response) return createResponse(res, resStatusCode.SUCCESS_FETCH, resMsg.SUCCESS_FETCH, response);
        else
            return createError(res, resStatusCode.UNABLE_FETCH, { message: resMsg.UNABLE_FETCH })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

