'use strict';

var express = require('express'),
    app = express(),
    Q = require('q'),
    _ = require('lodash-node'),
    bodyParser = require('body-parser'),
    allowCrossDomain = require('./modules/middlewares/allowCrossDomain'),
    Logger = require('./modules/Logger'),
    logger = new Logger('alterServer'),
    Reporter = require('./modules/Reporter'),
    Config = require('./modules/Config'),
    reporter = new Reporter(),
    FileSystemLayer = require('./modules/FileSystemLayer'),
    FileGenerator = require('./modules/FileGenerator'),
    WadlParser = require('./modules/WadlParser'),
    ReadyFilesProcessor = require('./modules/ReadyFilesProcessor');

/* Inserting of middlewares */
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Processing of requests */
app.get('/', function(req, res) {
    res.send('Generator service. Processed by node.js.');
});


app.post('/generate', function(req, res) {
    let pathToProject = req.body.pathToProject ?
        req.body.pathToProject :
        Config.pathToProject,
        fileSystemLayerInstance = FileSystemLayer.getInstance(pathToProject);

    fileSystemLayerInstance.createProjectStructure();

    let dependencies = req.body.dependencies ? req.body.dependencies : [],
        promise = WadlParser.parseWadlObject(req.body.wadlObject),
        bowerPromise = null,
        linksPromise = null,
        readyFilesPromise = ReadyFilesProcessor.process(),
        generationPromises = [];

    promise.progress(function(descriptor) {
        let generationPromise = FileGenerator.generateFromDescriptor(descriptor);
        generationPromises.push(generationPromise)
    });



    Q.all([promise, readyFilesPromise]).then(function(result) {
        let readyFiles = result[1];
        bowerPromise = FileGenerator.generateBowerJson(dependencies);
        linksPromise = FileGenerator.generateLinksAndRoutes(generationPromises, dependencies, readyFiles.links, readyFiles.modules, readyFiles.css);


        Q.all([linksPromise, bowerPromise]).then(function() {
            res.sendStatus(200);
        }, function() {
            res.sendStatus(500);
        });

    });

});


/* Start server */
app.listen(Config.port);

logger.log("Server was started on " + Config.port);

reporter.start(60000);