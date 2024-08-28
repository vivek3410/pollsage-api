const express = require('express');
const authRoutes = require('./auth.routes')

const router = express.Router();
module.exports = router;


router.use('/auth', authRoutes);