'use strict';

var _ = require('lodash-node'),
    Q = require('q'),
    utils = require('./../utils'),
    ModulesStorage = require('./../ModulesStorage'),
    TemplateStorage =  require('./../TemplateStorage');


class RouteGenerator {

    constructor() {
        this.routes = [];
    }

    generateRoutesContent() {
        return this.routes.length ? this.routes.reduce(function(template, route) {
            return template +  route + "\n";
        }) : "";
    };

    clearRoutes() {
        this.routes = [];
    }

    addRoute(controller, service, view, isEmpty) {
        let defer = Q.defer(),
            module = ModulesStorage.getModule(service);

        TemplateStorage.getTemplate('route').then((template) => {
            template = template.replace(/<serviceName>/g, service);
            template = template.replace(/<plural>/g, module.plural);
            template = template.replace(/<controllerName>/g, controller);
            template = template.replace(/<serviceSingularName>/g, view + "/" + view);

            if(isEmpty) template = template.replace(/<start-is-empty>[\s\S]*<end-is-empty>/g, "");
            else {
                template = template.replace(/<start-is-empty>/g, "");
                template = template.replace(/<end-is-empty>/g, "");
            }
            this.routes.push(template);

            defer.resolve(template);
        });

        return defer.promise;
    };

}

module.exports = RouteGenerator;