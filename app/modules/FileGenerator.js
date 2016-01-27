'use strict';

var Logger = require('./Logger'),
    logger = new Logger('FileGenerator'),
    _ = require('lodash-node'),
    utils = require('./utils'),
    Q = require('q'),
    FileSystemLayer =  require('./FileSystemLayer'),
    fileSystemLayerInstance = FileSystemLayer.getInstance(),
    ViewGenerator = require('./generators/ViewGenerator'),
    PackageGenerator = require('./generators/PackageGenerator'),
    ServiceGenerator = require('./generators/ServiceGenerator'),
    ControllerGenerator = require('./generators/ControllerGenerator'),
    ModulesStorage = require('./ModulesStorage'),
    LinkGenerator = require('./generators/LinkGenerator'),
    linkGenerator = new LinkGenerator(),
    RouteGenerator = require('./generators/RouteGenerator'),
    routeGenerator = new RouteGenerator();

class FileGenerator {

    static generateBowerJson(dependencies) {
        return PackageGenerator.generateBowerJson(dependencies);
    }

    static generateFromDescriptor(descriptor) {
        let keySingular = descriptor.params.name,
            keyPlural = descriptor.params.plural,
            controllerName = utils.toSentenceCase(keySingular);

        let controllerPromise = ControllerGenerator.generateController(keySingular, controllerName),
            servicePromise = ServiceGenerator.generateService(descriptor, keySingular, keyPlural),
            viewPromise = ViewGenerator.generateView(keySingular, controllerName);

        ModulesStorage.addModule(descriptor.params.name, {
            singular: keySingular,
            plural: keyPlural,
            controller: {
                name: controllerName
            },
            service: {
                name: keySingular
            },
            view: {
                name: keySingular
            }
        });

        return Q.all([
            controllerPromise,
            servicePromise,
            viewPromise
        ]);
    }

    static generateLinksAndRoutes(promises, dependencies, links, modules, css) {
        let dfd = Q.defer();

        routeGenerator.clearRoutes();
        linkGenerator.clearAll();

        links.forEach(function(link) {
            linkGenerator.addAdditionalLink(link);
        });

        css.forEach(function(link) {
            linkGenerator.addStyleLink(link);
        });

        modules.forEach(function(module) {
            linkGenerator.addModule(module);
        });

        dependencies.forEach(function(dependency) {
            if(dependency.paths && _.isArray(dependency.paths))
                dependency.paths.forEach(function(path) {
                    linkGenerator.addLibLink('bower_components/' + path);
                });

            if(dependency.modules && _.isArray(dependency.modules))
                dependency.modules.forEach(function(module) {
                    linkGenerator.addModule(module);
                });

            if(dependency.css && _.isArray(dependency.css))
                dependency.css.forEach(function(file) {
                    linkGenerator.addStyleLink('bower_components/' + file);
                });
        });

        Q.all(promises).then(function(allResults) {
            let routePromises = [],
                writePromises = [];

            _.forEach(allResults, function(result) {
                let controller = result[0].name,
                    service = result[1].name,
                    isEmpty = result[1].isEmpty,
                    view = result[2].name;

                routePromises.push(
                    routeGenerator.addRoute(controller, service, view, isEmpty)
                );

                linkGenerator.addControllerLink(controller);
                linkGenerator.addServiceLink(service);
            });

            Q.all(routePromises).then(function() {

                let routesContent = routeGenerator.generateRoutesContent();
                let modulesContent = linkGenerator.generateModulesContent();

                writePromises.push(
                    fileSystemLayerInstance.writeToRouter(routesContent, modulesContent)
                )
            });

            let controllerLinksContent = linkGenerator.generateControllerLinksContent(),
                serviceLinksContent = linkGenerator.generateServiceLinksContent(),
                additionalLinksContent = linkGenerator.generateAdditionalLinksContent(),
                libLinksContent = linkGenerator.generateLibLinksContent(),
                cssLinksContent = linkGenerator.generateStyleLinksContent();

            writePromises.push(
                fileSystemLayerInstance.writeLinksToIndex(controllerLinksContent, serviceLinksContent, libLinksContent,
                    additionalLinksContent, cssLinksContent)
            );

            Q.all(routePromises).then(function(result) {
                dfd.resolve(result);
            })
        });

        return dfd.promise;
    }
}

module.exports = FileGenerator;