'use strict';

var TemplateStorage =  require('./../TemplateStorage'),
    FileSystemLayer =  require('./../FileSystemLayer'),
    fileSystemLayerInstance = FileSystemLayer.getInstance(),
    Q = require('q');

class ControllerGenerator {

    static generateView(keySingular, controllerName) {
        let defer = Q.defer(),
            viewName = keySingular,
            templatePromise = TemplateStorage.getTemplate('view');

        templatePromise.then(function(template) {
            let viewFile = template.replace(/<controllerName>/g, controllerName);

            fileSystemLayerInstance.addView(viewName, viewFile).then(function() {
                defer.resolve({name: viewName});
            });
        });

        return defer.promise;

    };

}

module.exports = ControllerGenerator;