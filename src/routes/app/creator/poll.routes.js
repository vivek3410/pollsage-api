const express = require('express');
const asyncHandler = require('express-async-handler');
const pollCtrl = require('../../../controllers/creators/poll.controller');
const { createResponse, createError } = require('../../../../utils/helpers');
const { resStatusCode, resMsg } = require('../../../../config/constants');
const router = express.Router();
module.exports = router


/*
 * @route POST api/v1/creators/polls
 * @description Add Polls Question
 * @returns JSON
 * @access private
 */

router.post('/', asyncHandler(addPoll))

/*
 * @route GET api/v1/creators/polls
 * @description get all polls
 * @returns JSON
 * @access private
 */

router.get('/', asyncHandler(getAllPolls))

/*
 * @route GET api/v1/creators/polls/:pollId
 * @description get poll by pollId
 * @returns JSON
 * @access private
 */
router.get("/:pollId", asyncHandler(getPollByPollId));

/*
 * @route UPDATE api/v1/creators/polls/:pollId
 * @description get poll by pollId
 * @returns JSON
 * @access private
 */
router.put("/:pollId", asyncHandler(updatePollByPollId));

/*
 * @route DELETE api/v1/creators/polls/:pollId
 * @description delete poll by pollId
 * @returns JSON
 * @access private
 */
router.delete("/:pollId", asyncHandler(deletePoll));




async function addPoll(req, res, next) {
    try {
        let response = await pollCtrl.addPoll(req);
        if (response) return createResponse(res, resStatusCode.CREATED, resMsg.CREATED, response);
        else
            return createError(res, resStatusCode.UNABLE_CREATE, { message: resMsg.UNABLE_CREATE })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function getAllPolls(req, res, next) {
    try {
        let response = await pollCtrl.getAllPolls(req);
        if (response) return createResponse(res, resStatusCode.SUCCESS_FETCH, resMsg.SUCCESS_FETCH, response);
        else
            return createError(res, resStatusCode.UNABLE_FETCH, { message: resMsg.UNABLE_FETCH })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function getPollByPollId(req, res, next) {
    try {
        let response = await pollCtrl.getPollByPollId(req);
        if (response) return createResponse(res, resStatusCode.SUCCESS_FETCH, resMsg.SUCCESS_FETCH, response);
        else
            return createError(res, resStatusCode.UNABLE_FETCH, { message: resMsg.UNABLE_FETCH })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function updatePollByPollId(req, res, next) {
    try {
        let response = await pollCtrl.updatePollByPollId(req);
        if (response) return createResponse(res, resStatusCode.UPDATED, resMsg.UPDATED, response);
        else
            return createError(res, resStatusCode.UNABLE_UPDATE, { message: resMsg.UNABLE_UPDATE })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

async function deletePoll(req, res, next) {
    try {
        let response = await pollCtrl.deletePoll(req);
        if (response) return createResponse(res, resStatusCode.DELETED, resMsg.DELETED, response);
        else return createError(res, resStatusCode.UNABLE_DELETE, { message: resMsg.UNABLE_DELETE })
    } catch (e) {
        return createError(res, resStatusCode.BAD_REQUEST, e)
    }
}

