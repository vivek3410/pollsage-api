
const express = require('express')
const cors = require('cors');
const session = require('express-session');
const requestLog = require('./src/middleware/request-log');
const logger = require('./config/logger');
const config = require('./config/config');
const passport = require('./config/passport')
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./src/routes/index.routes');
const errorHandler = require('./src/middlewares/error_handler');
require('./config/mongoose')
const app = express();

app.use(requestLog);

// Middleware for logging

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - Query: ${JSON.stringify(req.query)}`)
    next();
})


// CORS middleware
app.use(cors());

// session middleware
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet())

// middleware
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/v1/', routes)

// Invalid Route
app.all("/api/v1/*", (req, res) => {
    return res.status(400).json({ status: 400, message: "Bad Request" });
});


app.use(errorHandler)

module.exports = app