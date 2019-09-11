/**
 * Configurations of logger.
 */
const winston = require('winston');
  require('winston-daily-rotate-file');
  const { combine, timestamp, label, prettyPrint } = winston.format;

var transportSuccess = new (winston.transports.DailyRotateFile)({
  filename: './log/application-combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
var transportError = new (winston.transports.DailyRotateFile)({
  filename: './log/application-error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error'
});

transportSuccess.on('rotate', function(oldFilename, newFilename) {
  // do something fun
}); 
transportError.on('rotate', function(oldFilename, newFilename) {
  // do something fun
}); 

var logger = winston.createLogger({
  format: combine(
    label({ label: 'Testing logs' }),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    transportSuccess,
    transportError
  ]
  // exceptionHandlers: [
  //   new transports.File({ filename: './log/exceptions.log' })
  // ]
}); 

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write to all logs with level `info` and below to `combined.log` 
//     // - Write all logs error (and below) to `error.log`.
//     //
//     new winston.transports.File({ filename: 'error-%DATE%.log',datePattern: 'YYYY-MM-DD-HH', level: 'error' }),
//     new winston.transports.File({ filename: 'combined-%DATE%.log', datePattern: 'YYYY-MM-DD-HH' })
//   ]
// });

module.exports = logger;