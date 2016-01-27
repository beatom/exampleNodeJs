'use strict';

var exec = require("child_process").exec,
    Logger = require('./Logger'),
    logger = new Logger('TaskRunner'),
    Q = require("q");

class TaskRunner {

    static runBower(path) {
        exec('bower i', {cwd: path}, function(answ, err) {
            if(error) {
                logger.error(err);
            }
        });
    }
}

module.exports = TaskRunner;
