'use strict';

var modules = {

};

class ModulesStorage {

    static addModule(key, module) {
        modules[key] = module;
    }

    static getModule(key) {
        return modules[key];
    }

}

module.exports = ModulesStorage;