const { format } = require("logform");
const os = require('os');
const winston = require("winston");
const config = require("./config");


const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] [${os.hostname()}] [${level.toUpperCase()}]: ${message}`
    })
)

const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        // new winston.transports.DailyRotateFile({
        //     filename: 'logs/application-%DATE%.log',
        //     datePattern: 'YYYY-MM-DD',
        //     zippedArchive: true,
        //     maxSize: '20m',
        //     maxFiles: '14d'
        // })
    ]
})

module.exports = logger