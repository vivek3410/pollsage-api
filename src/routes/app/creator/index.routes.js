const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes')
const themeRoutes = require('./theme.routes')
const pollRoutes = require('./poll.routes')
const passport = require('passport')

module.exports = router;

router.get('/health-check', (req, res) => {
    res.send('OK');
})

router.use('/auth', authRoutes);

// /polls - for poll related routes
router.use('/polls', passport.authenticate('jwt', { session: false }), pollRoutes)

router.use('/themes', passport.authenticate('jwt', { session: false }), themeRoutes)

