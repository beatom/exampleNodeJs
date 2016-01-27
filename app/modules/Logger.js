'use strict';

var winston = require('winston'),
    path = require('path');


var winstonOptions = {
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './all-logs.log',
            handleExceptions: false,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: false,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
};

class Logger {

    constructor(moduleName) {
        //winston.emitErrs = true;
        this.logger = new winston.Logger(winstonOptions);
        if(!moduleName) moduleName = "unknown";
        this.moduleName = moduleName;
    }

    prefix() {
        return (new Date()).toTimeString() + ' module: ' + this.moduleName + ', message: ';
    }

    log() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.prefix());
        this.logger.info.call(this, args);
    }

    info() {
        this.log()
    }

    warn() {
        this.warnCounter ++;
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.prefix());
        this.logger.warn.call(this, args);
    }

    error() {
        this.errorCounter ++;
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.prefix());
        this.logger.error.call(this, args);
    }

}

module.exports = Logger;
