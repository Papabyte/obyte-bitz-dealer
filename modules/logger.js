"use strict";
const winston = require('winston');

require('winston-daily-rotate-file');

var transportDebug = new (winston.transports.DailyRotateFile)({
	level: 'debug',
	filename:  'debug-%DATE%.log',
	dirname:  "logs",
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '2d'
});

var transportInfo = new (winston.transports.DailyRotateFile)({
	level: 'info',
	filename:  'info-%DATE%.log',
	dirname:  "logs",
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d'
});

var transportError = new (winston.transports.DailyRotateFile)({
	level: 'error',
	filename:  'error-%DATE%.log',
	dirname:  "logs",
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d'
});

const myFormat = winston.format.printf(info => {
	return `${info.timestamp}  [${info.level}]: ${info.message}`;
  });

var logger =  winston.createLogger({
	format:  winston.format.combine(
		winston.format.timestamp(),
		myFormat
	  ),
	transports: [transportDebug,transportInfo,transportError],
	level:'debug'
});


module.exports = logger;
