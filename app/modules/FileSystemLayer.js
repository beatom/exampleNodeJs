'use strict';

var mkdirp   = require("mkdirp"),
    fs = require("fs-extra"),
    _ = require("lodash-node"),
    Q = require("q"),
    utils = require("./utils"),
    TemplateStorage = require("./TemplateStorage"),
    TaskRunner = require("./TaskRunner"),
    Config = require('./Config'),
    Logger = require('./Logger'),
    logger = new Logger('FileSystemLayer');

var instance = null;

class FileSystemLayer {

    constructor(pathToProject) {
        if(!pathToProject) pathToProject = Config.pathToProject;
        if(!pathToProject.endsWith('/')) pathToProject += '/';

        this.paths = {
            pathToProject: pathToProject,
            servicesFolder: pathToProject + "scripts/services/",
            directivesFolder: pathToProject + "scripts/directives/",
            controllersFolder: pathToProject + "scripts/controllers/",
            viewsFolder: pathToProject + "views/",
            viewsDirectivesFolder: pathToProject + "views/directives"
        }
    }

    getPaths() {
        return this.paths;
    }

    static getInstance(pathToProject) {
        if(!instance)
            instance = new FileSystemLayer(pathToProject);
        return instance
    }

    static readFile(path) {
        let filePromise = Q.nfcall(fs.readFile, path, 'utf8');
        filePromise.catch(function(error) {
           logger.error("Failed to load file " + path, error);
        });
        return filePromise;
    };

    static copyFile(source, destination) {
        try {
            fs.copySync(source, destination);
        } catch (error) {
            logger.error(error);
        }
    };

    addController(name, content) {
        let path = this.paths.controllersFolder + name + ".js";
        return this.writeFile(path, content, true);
    };

    addService(name, content) {
        let path = this.paths.servicesFolder + name + ".js";
        return this.writeFile(path, content, true);
    };

    addView(name, content) {
        if(!FileSystemLayer.checkIsEntityExists(this.paths.viewsFolder + "/" + name))
            FileSystemLayer.createFolder(this.paths.viewsFolder + "/" + name);
        
        return this.writeFile(this.paths.viewsFolder + "/" + name + "/" + name + ".html", content, true)
    };

    addBowerJson(content) {
        let promise = this.writeFile(this.paths.pathToProject + "/bower.json", content, true),
            path = this.paths.pathToProject;
        
        promise.then(function() {
            TaskRunner.runBower(path);
        });
        return promise
    };

    writeFile(path, content, overwrite) {
        let defer = Q.defer(),
            stream = fs.createWriteStream(path);

        if(!overwrite && FileSystemLayer.checkIsEntityExists(path)) {
            defer.resolve(content);
            return;
        }

        stream.once('open', function() {
            stream.write(content);
            defer.resolve(content);
            stream.end();
        });

        return defer.promise;
    };

    createProjectStructure() {
        FileSystemLayer.createFolder(this.paths.pathToProject);
        FileSystemLayer.createFolder(this.paths.directivesFolder);
        FileSystemLayer.createFolder(this.paths.servicesFolder);
        FileSystemLayer.createFolder(this.paths.controllersFolder);
        FileSystemLayer.createFolder(this.paths.viewsFolder);
        FileSystemLayer.createFolder(this.paths.viewsDirectivesFolder);
    };

    writeLinksToIndex(controllerLinks, serviceLinks, libLinks, additionalLinks, cssLinks) {

        let pathToIndex = this.paths.pathToProject+ "/index.html",
            readyToWriteDefer = Q.defer(),
            dfd = Q.defer();

        if(!FileSystemLayer.checkIsEntityExists(pathToIndex)) {
            TemplateStorage.getTemplate('index').then(function(tpl) {
                readyToWriteDefer.resolve(tpl);
            });
        } else {
            Q.nfcall(fs.readFile, pathToIndex, 'utf8').then(function(tpl) {
                readyToWriteDefer.resolve(tpl);
            });
        }


        readyToWriteDefer.promise.then((template) => {
            let legacyControllerLinks = utils.findBetween(template, "<!-- cg-controllers-start -->", "<!-- cg-controllers-end -->"),
                legacyServiceLinks = utils.findBetween(template, "<!-- cg-services-start -->", "<!-- cg-services-end -->"),
                legacyLibLinks = utils.findBetween(template, "<!-- cg-lib-start -->", "<!-- cg-lib-end -->"),
                legacyAdditionalLinks = utils.findBetween(template, "<!-- cg-additional-start -->", "<!-- cg-additional-end -->"),
                legacyCssLinks = utils.findBetween(template, "<!-- cg-style-start -->", "<!-- cg-style-end -->"),

            controllerLinks = utils.safeConcat(controllerLinks, legacyControllerLinks);
            serviceLinks = utils.safeConcat(serviceLinks, legacyServiceLinks);
            libLinks = utils.safeConcat(libLinks, legacyLibLinks);
            additionalLinks = utils.safeConcat(additionalLinks, legacyAdditionalLinks);
            cssLinks = utils.safeConcat(cssLinks, legacyCssLinks);

            template = utils.pasteBetween(template, "<!-- cg-controllers-start -->", "<!-- cg-controllers-end -->", controllerLinks);
            template = utils.pasteBetween(template, "<!-- cg-services-start -->", "<!-- cg-services-end -->", serviceLinks);
            template = utils.pasteBetween(template, "<!-- cg-lib-start -->", "<!-- cg-lib-end -->", libLinks);
            template = utils.pasteBetween(template, "<!-- cg-additional-start -->", "<!-- cg-additional-end -->", additionalLinks);
            template = utils.pasteBetween(template, "<!-- cg-style-start -->", "<!-- cg-style-end -->", cssLinks);


            this.writeFile(pathToIndex, template, true).then(
                function(result) {
                    dfd.resolve(result);
                }
            )
        });
        return dfd.promise;
    };

    writeToRouter(routes, modules) {
        let pathToRouter = this.paths.pathToProject + "/scripts/app.js",
            readyToWriteDefer = Q.defer(),
            dfd = Q.defer();

        if(!FileSystemLayer.checkIsEntityExists(pathToRouter))
            TemplateStorage.getTemplate('router').then(function(tpl) {
                readyToWriteDefer.resolve(tpl);
            });
        else
            Q.nfcall(fs.readFile, pathToRouter, 'utf8').then(function(tpl) {
                readyToWriteDefer.resolve(tpl);
            });

        readyToWriteDefer.promise.then((template) => {
            let legacyRoutes = utils.findBetween(template, "/* cg-routes-start */", "/* cg-routes-end */"),
            legacyModules = utils.findBetween(template, "/* cg-modules-start */", "/* cg-modules-end */");

            routes = '.when' + utils.safeConcat(routes, legacyRoutes, '.when');
            modules = utils.safeConcat(modules, legacyModules, ',');

            template = utils.pasteBetween(template, "/* cg-routes-start */", "/* cg-routes-end */", routes);
            template = utils.pasteBetween(template, "/* cg-modules-start */", "/* cg-modules-end */", modules);

            this.writeFile(pathToRouter, template, true)
                .then(
                    function(result) {
                        dfd.resolve(result);
                    }

                )
        });

        return dfd.promise;
    }

    static checkIsEntityExists(path) {
        return fs.existsSync(path);
    }

    static createFolder(path) {
        if(!FileSystemLayer.checkIsEntityExists(path)) {
            mkdirp.sync(path);
        }
    }
}

module.exports = FileSystemLayer;
