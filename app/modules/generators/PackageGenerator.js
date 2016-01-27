'use strict';

var _ = require('lodash-node'),
    Q = require('q'),
    TemplateStorage =  require('./../TemplateStorage'),
    FileSystemLayer =  require('./../FileSystemLayer'),
    fileSystemLayerInstance = FileSystemLayer.getInstance();


class PackageGenerator {

    static generateBowerJson(dependencies) {
        let defer = Q.defer(),
            templatePromise = TemplateStorage.getTemplate('package');

        templatePromise.then(function(template) {
            var dependenciesBlock = "";
            _.forEach(dependencies, function(dependency) {
                if(!dependency.version)
                    dependency.version = "latest";
                dependenciesBlock +=
                    '\"'+dependency['bower-name']+
                    '\": \"'+
                    dependency.version +'\",\n';
            });
            dependenciesBlock = dependenciesBlock.substr(0, dependenciesBlock.length - 2);
            template = template.replace(/<dependencies-list>/g, dependenciesBlock);
            fileSystemLayerInstance.addBowerJson(template).then(function(res) {
                defer.resolve(res);
            });
        });

        return defer.promise;
    };

}

module.exports = PackageGenerator;