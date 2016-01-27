'use strict';

var Logger = require('./Logger'),
    logger = new Logger('Reporter');

class Reporter {
    constructor() {
        this.warnCounter =
            this.errorCounter =
                this.uptime = 0;
    }

    start(interval) {
        let logger = new Logger("Reporter");
        setInterval(() => {
            this.uptime += interval / 60000;
            this.report(logger);
        }, interval)
    }

    report() {
        logger.log("Uptime " + this.uptime + "m");
        logger.log("Errors " + this.errorCounter);
        logger.log("Warnings " + this.warnCounter);
    }
}

module.exports = Reporter;