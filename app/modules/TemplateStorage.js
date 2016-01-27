'use strict';

var Logger = require('./Logger'),
    logger = new Logger('TemplateStorage'),
    Q = require('q'),
    path = require('path'),
    fs = require("fs-extra"),
    utils = require("./utils"),
    request = require('request-promise');

var templates = {
    "controller": null,
    "service": null,
    "view": null,
    "function": null,
    "route": null,
    "router": null,
    "index": null
};

class TemplateStorage {

    static getTemplate(name) {
        let defer = Q.defer();
        if(templates[name])
            defer.resolve(templates[name]);

        else Q.nfcall(fs.readFile, './templates/' + name + '.tpl', 'utf8')
            .then(function(template) {
                templates[name] = template;
                defer.resolve(template);
            }, function() {
                logger.error(utils.toSentenceCase(name) + "Index template not found.");
            });

        return defer.promise
    }

}

module.exports = TemplateStorage;