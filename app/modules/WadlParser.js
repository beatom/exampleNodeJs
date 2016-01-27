'use strict';

var _ = require('lodash-node'),
    Q = require('q'),
    Logger = require('./Logger'),
    logger = new Logger('WadlParser'),
    request = require('request-promise');

class WadlParser {

    static parseWadlObject(wadlObject) {
        let promises = [],
            defer = Q.defer(),
            result = {
            descriptors: [],
            dependencies: []
        };

        function finish() {
            Q.all(promises).then(function() {
                defer.resolve(result);
            });
        }

        _.forEach(wadlObject.resource, function(resource, i) {
            if(!resource.selected) {
                if(i == wadlObject.resource.length - 1) {
                    finish();
                }
                return;
            }

            if(!_.isArray(resource.resource))
                resource.resource = [resource.resource];

            var descriptor = {
                empty: resource.empty,
                url: wadlObject._base + '/' + resource._path,
                base: wadlObject._base + '/',
                requests: resource.resource
            };

            if(resource._wsdl.endsWith('api/?wsdl')) {
                defer.notify(descriptor);
                result.descriptors.push(descriptor);
                if(i == wadlObject.resource.length - 1) finish();
            } else {
                var wsdlPromise = request(resource._wsdl);
                promises.push(wsdlPromise);
                wsdlPromise.then(function(response) {
                    try{
                        response = JSON.parse(response);
                        descriptor.params = response;
                        defer.notify(descriptor);
                        result.descriptors.push(descriptor);
                    } catch (error) {
                        logger.error("Parse error")
                    } finally {
                        if(i == wadlObject.resource.length - 1) {
                            finish();
                        }
                    }
                }).finally(function() {
                    if(i == wadlObject.resource.length - 1) {
                        finish();
                    }
                });
            }
        });

        return defer.promise;
    };

}

module.exports = WadlParser;