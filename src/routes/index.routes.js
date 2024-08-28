const express = require('express');
const creatorRoutes = require('./app/creator/index.routes')
const adminRoutes = require('./admin/index.routes')

const router = express.Router();

router.get('/health-check', (req, res) => {
    res.send("OK")
})

// /creators - for creators related routes
router.use('/creators', creatorRoutes)

router.use('/admin', adminRoutes)

module.exports = router