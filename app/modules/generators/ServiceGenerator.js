'use strict';

var _ = require('lodash-node'),
    Q = require('q'),
    TemplateStorage =  require('./../TemplateStorage'),
    FileSystemLayer =  require('./../FileSystemLayer'),
    fileSystemLayerInstance = FileSystemLayer.getInstance(),
    FunctionGenerator =  require('./FunctionGenerator');


class ServiceGenerator {

    static generateService(descriptor, keySingular, keyPlural) {
        let serviceMethodList = [],
            defer = Q.defer();

        _.forEach(descriptor.requests, function(request) {
            serviceMethodList.push({
                params:  request.method.request.param,
                path: request._path,
                method: request.method._name,
                url: descriptor.url
            })
        });

        let methodsPromise = FunctionGenerator.generateMethods(serviceMethodList, keySingular, keyPlural),
            templatePromise = TemplateStorage.getTemplate('service');

        Q.all([templatePromise, methodsPromise]).then(function(result) {
                let template = result[0],
                    methods = result[1];

                template = template.replace(/<serviceName>/g, keySingular);

                if(descriptor.empty) {
                    methods.declaration = "";
                    methods.implementation = "";
                }

                template = template.replace(/<methodList>/g, methods.declaration);
                template = template.replace(/<methodBodyList>/g, methods.implementation);

                fileSystemLayerInstance.addService(keySingular, template).then(function() {
                    defer.resolve({name: keySingular, isEmpty: descriptor.empty});
                });
            });



        return defer.promise;
    };

}

module.exports = ServiceGenerator;