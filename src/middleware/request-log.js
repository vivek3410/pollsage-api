const RequestLog = require('../models/analytics/request_log.model')

const requestLog = async (req, res, next) => {
    const requestTime = Date.now();

    // skip logging for OPTIONS requests
    if (req.method === 'OPTIONS') {
        // continue to the next middleware with out logging
        return next();
    }

    res.on('finish', async () => {
        let user_info = null;
        if (req.user) {
            // include user information when the user is authenticated
            user_info = req.user._id
        }

        const response_time = (Date.now() - requestTime) / 1000 // convert to seconds
        const status_code = res.statusCode;


        try {
            await RequestLog.create({
                url: req.baseUrl + req.path,
                method: req.method,
                response_time,
                status_code,
                user_info
            })

            console.log("Request created successfully");
        } catch (e) {
            console.error("Error creating requestLog", e)
        }
    })

    next()
}

module.exports = requestLog