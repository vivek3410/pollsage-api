
const { handleControllerError, generateString } = require('../../../utils/helpers');
const PollCreator = require('../../models/creator.model');
const { createPollValidation, updatePollValidation } = require('../../validations/creators/poll.validations');
const Poll = require('../../models/poll.model');
const { resMsg } = require('../../../config/constants');


module.exports = {
    addPoll,
    getAllPolls,
    getPollByPollId,
    updatePollByPollId,
    deletePoll,
}

async function addPoll(req) {
    try {
        const { error } = createPollValidation.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }
        const { body } = req
        body.pollId = generateString(6);

        const poll = await new Poll(body).save();

        const pollCreatorUpdateResult = await PollCreator.findByIdAndUpdate(
            req.user._id,
            {
                $push: { createdPolls: poll._id },
                $inc: { totalPollsCreated: 1 }
            }
        )

        // check if the Poll creator update was successful
        if (!pollCreatorUpdateResult) {
            throw new Error("Failed to update poll creator with" + req.user._id)
        }

        return poll;
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function getAllPolls(req) {
    try {
        const polls = await PollCreator.aggregate([
            {
                $match: { _id: req.user._id },
            },
            {
                $lookup: {
                    from: 'polls',
                    localField: 'createdPolls',
                    foreignField: '_id',
                    as: 'createdPolls',
                }
            },
            {
                $unwind: '$createdPolls',
            },
            {
                $sort: { 'createdPolls.createdAt': -1 }
            },
            {
                $group: {
                    _id: '$_id',
                    createdPolls: { $push: '$createdPolls' }
                }
            }
        ])


        let currentPage = Number(req.query.page) || 1;
        let perPage = Number(req.query.limit) || 10;

        if (polls.length > 0) {
            const createdPolls = polls[0].createdPolls;
            // Calculate pagination details
            const totalPolls = createdPolls.length;
            const skipCount = (currentPage - 1) * perPage;
            const totalPages = Math.ceil(totalPolls / perPage);
            const paginatedPolls = createdPolls.slice(skipCount, skipCount + perPage);
            const pagination = {
                itemCount: totalPolls,
                docs: paginatedPolls,
                perPage: perPage,
                currentPage: currentPage,
                next: Number(currentPage) < totalPages ? Number(currentPage) + 1 : null,
                prev: currentPage > 1 ? currentPage - 1 : null,
                pageCount: totalPages,
                slNo: skipCount + 1
            }
            return pagination
        }

        return null;
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function getPollByPollId(req) {
    try {
        const pollId = req.params.pollId;
        if (!pollId) {
            throw Error('poll id is required')
        }

        let poll = await Poll.findOne({ pollId });
        if (!poll) {
            throw Error(resMsg.NO_RECORD_FOUND)
        }

        return poll
    } catch (e) {
        throw handleControllerError(e)
    }
}

async function updatePollByPollId(req) {
    try {
        const pollId = req.params.pollId;

        if (!pollId) {
            throw Error("poll id is required")
        }

        const { error } = updatePollValidation.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }

        let poll = await Poll.findOne({ pollId });
        if (!poll) {
            throw Error(resMsg.NO_RECORD_FOUND)
        }
        console.log(poll);
        let updatePoll = await Poll.findOneAndUpdate(
            { pollId },
            {
                $set: req.body,
            },
            { new: true }
        )

        return updatePoll
    } catch (e) {
        throw handleControllerError()
    }
}

async function deletePoll(req) {
    try {
        const pollId = req.params.pollId;

        // Retrieve the poll from the database
        const poll = await Poll.findOne({ pollId });

        if (!poll) {
            throw Error(resMsg.NO_RECORD_FOUND);
        }

        await Poll.findByIdAndDelete(poll._id);


        return true;
    } catch (e) {
        throw handleControllerError(e)
    }
}
