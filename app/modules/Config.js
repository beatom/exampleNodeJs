'use strict';

class Config {

    static get defaults() {
        return {
            pathToProject: "/home/cmp/work/test_gen/",
            port: "1999"
        }
    };

    static get pathToProject() {
        return this.defaults.pathToProject;
    }

    static set pathToProject(pathToProject) {
        this.defaults.pathToProject = pathToProject;
    }

    static get port() {
        return this.defaults.port;
    }

    static set port(port) {
        this.defaults.port = port;
    }
}

module.exports = Config;