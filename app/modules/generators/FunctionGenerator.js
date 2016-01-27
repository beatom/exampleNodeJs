'use strict';

var _ = require('lodash-node'),
    Q = require('q'),
    utils = require('./../utils'),
    TemplateStorage =  require('./../TemplateStorage');


class FunctionGenerator {

    static getDeclarationName(method, isSingular) {
        let name = "";

        switch (method) {
            case 'get' : {
                name = isSingular ? 'get' : 'getAll';
                break;
            }
            case 'post' : {
                name = 'change';
                break;
            }
            case 'put' : {
                name = 'add';
                break;
            }
            case 'delete' : {
                name = 'remove';
                break;
            }
        }

        return name;
    }

    static generateMethod(desc, singular, plural) {
        let defer = Q.defer(),
            templatePromise = TemplateStorage.getTemplate('function');

        templatePromise.then(function(template) {
            //let functionName = desc.method.toLowerCase() + utils.toSentenceCase(singular),
            let apiMethodName = desc.method.toLowerCase(),
                paramList = "",
                apiData = "",
                apiConfig = "",
                apiPath = '\'' + desc.url.split("api/")[1] + '\'',
                additionalParameters = "";

            //if(!desc.path) functionName += 's';


            if(desc.path && desc.path.indexOf("_id") != -1) {
                let params = desc.path.split('/');
                if(params.length > 1)
                    additionalParameters = utils.toSentenceCase(params[params.length - 1].trim());
                paramList += params.join(', ');
                apiPath += ' + \'/\' + ' + params.join(' + \'/\' + ');
            }

            switch (apiMethodName) {
                case 'post':
                case 'put': {
                    paramList += paramList.length > 0 ? ", data" : "data";
                    apiData = ", {" + singular + ": data}";
                    break
                }
                case 'get':
                    apiData = ", {}";
                    apiConfig = paramList ? ", {key: '" + plural + "'}" : ", {key: '" + singular + "'}";
                    break;
            }

            let functionName = FunctionGenerator.getDeclarationName(apiMethodName, !!paramList) + additionalParameters;

            template = template.replace(/<methodName>/g, functionName);
            template = template.replace(/<apiMethod>/g, apiMethodName);
            template = template.replace(/<paramList>/g, paramList);
            template = template.replace(/<apiData>/g, apiData);
            template = template.replace(/<apiConfig>/g, apiConfig);
            template = template.replace(/<apiPath>/g, apiPath);



            let declaration = "'" + functionName +
                "' : " + functionName + ",\n\r            ";

            defer.resolve({
                implementation: template,
                declaration: declaration
            });
        });

        return defer.promise;
    };

    static generateMethods(list, singular, plural) {
        let defer = Q.defer(),
            implementationsTemplate = "",
            declarationsTemplate = "",
            promises = [];

        _.forEach(list, function(desc) {
            let promise = FunctionGenerator.generateMethod(desc, singular, plural);

            promise.then(function(result) {
                implementationsTemplate += result.implementation;
                declarationsTemplate += result.declaration;
            });

            promises.push(promise);
        });

        Q.all(promises).then(function() {
            defer.resolve({
                implementation: implementationsTemplate,
                declaration: declarationsTemplate
            });
        });

        return defer.promise;
    };
}

module.exports = FunctionGenerator;
