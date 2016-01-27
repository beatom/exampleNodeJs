'use strict';

var _ = require('lodash-node'),
    Logger = require('./../Logger'),
    logger = new Logger('LinkGenerator'),
    Q = require('q');

class LinkGenerator {

    constructor() {
        this.controllerLinks = [];
        this.serviceLinks =[];
        this.libLinks = [];
        this.styleLinks = [];
        this.additionalLinks = [];
        this.modules = [];
    }

    generateControllerLinksContent(){
        return this.controllerLinks.reduce(function(template, controllerLink) {
            return template + controllerLink + "\n\t";
        }, "");
    }

    generateServiceLinksContent(){
        return this.serviceLinks.reduce(function(template, serviceLink) {
            return template + serviceLink + "\n\t";
        }, "");
    }

    generateStyleLinksContent(){
        return this.styleLinks.reduce(function(template, styleLink) {
            return template + styleLink + "\n\t";
        }, "");
    }

    generateLibLinksContent(){
        return this.libLinks.reduce(function(template, libLink) {
            return template + libLink + "\n\t";
        }, "");
    }

    generateAdditionalLinksContent(){
        return this.additionalLinks.reduce(function(template, additionalLink) {
            return template + additionalLink + "\n\t";
        }, "");
    }

    generateModulesContent(){
        return this.modules.reduce((template, module, i) =>
            template + "\'" + module + "\'" + (i == this.modules.length - 1 ? "" : "," + "\n\t"),
            "");
    }

    static generateScriptLink(path) {
        return "<script src='" + path + "'></script>";
    }

    addControllerLink(name) {
        let path = 'scripts/controllers/' + name + '.js';
        this.controllerLinks.push(LinkGenerator.generateScriptLink(path));
    }

    addServiceLink(name) {
        let path = 'scripts/services/' + name + '.js';
        this.serviceLinks.push(LinkGenerator.generateScriptLink(path));
    }

    addStyleLink(path) {
        this.styleLinks.push("<link rel='stylesheet' href='" + path + "'/>");
    }

    addLibLink(path) {
        this.libLinks.push(LinkGenerator.generateScriptLink(path));
    }

    addAdditionalLink(path) {
        this.additionalLinks.push(LinkGenerator.generateScriptLink(path));
    }

    addModule(name) {
        this.modules.push(name);
    }

    clearAll() {
        this.controllerLinks = [];
        this.serviceLinks =[];
        this.libLinks = [];
        this.additionalLinks = [];
        this.styleLinks = [];
        this.modules = [];
    }

}

module.exports = LinkGenerator;