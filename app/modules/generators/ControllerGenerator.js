'use strict';

var TemplateStorage =  require('./../TemplateStorage'),
    FileSystemLayer =  require('./../FileSystemLayer'),
    fileSystemLayerInstance = FileSystemLayer.getInstance(),
    Q = require('q');

class ControllerGenerator {

    static generateController(keySingular, controllerName) {

        var defer = Q.defer();
        var templatePromise = TemplateStorage.getTemplate('controller');

        templatePromise.then(function(template) {
            var controllerFile = template;
            controllerFile = controllerFile.replace(/<controllerName>/g, controllerName);
            controllerFile = controllerFile.replace(/<serviceName>/g, keySingular);

            fileSystemLayerInstance.addController(controllerName, controllerFile).then(function() {
                defer.resolve({name: controllerName});
            });

        });

        return defer.promise;
    }
}

module.exports = ControllerGenerator;