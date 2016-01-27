'use strict';

var FileSystemLayer = require('./FileSystemLayer'),
    Q = require('q'),
    Logger = require('./Logger'),
    logger = new Logger("ReadyFilesProcessor"),
    _ = require('lodash-node'),
    fsInstance = FileSystemLayer.getInstance();

class ReadyFilesProcessor {

    static processGroup(group) {
        var result = {
            links: [],
            css: [],
            module: null
        };

        group.files.forEach((file) => {
            let source = 'templates/readyFiles/' + group.base + '/' + file.name,
                dest = fsInstance.getPaths().pathToProject + group.dest + '/' + file.name;

            if(group.include) {
                result.links.push(group.dest + '/' + file.name);
            }

            if(group.css) {
                result.css.push(group.dest + '/' + file.name);
            }

            if(group.module) result.module = group.module;

            FileSystemLayer.copyFile(source, dest);

        });

        return result;
    }

    static process() {
        let defer = Q.defer(),
            paths = [],
            css = [],
            modules = [];

        FileSystemLayer.readFile('templates/readyFiles/files.json').then(
            (content) => {
                try {
                    content = JSON.parse(content);
                } catch (error) {
                    logger.error("Can't parse files.json");
                    content = [];
                }
                content.forEach((group) => {
                    let processed = this.processGroup(group);
                    paths = paths.concat(processed.links);
                    if(processed.module) modules.push(processed.module);
                    if(processed.css) css = css.concat(processed.css);
                });

                defer.resolve({links: paths, modules: modules, css: css});
            }
        );

        return defer.promise;
    }

}

module.exports = ReadyFilesProcessor;