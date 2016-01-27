'use strict';

var Logger = require('./Logger');
var logger = new Logger('Utils');

class Utils {

    static toSentenceCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static findBetween(string, start, end) {
        return string.substring(
            string.indexOf(start) + start.length,
            string.indexOf(end)
        );
    }

    static pasteBetween(string, start, end, content) {
        return string.substring(0, string.indexOf(start) + start.length)
            + content
            + string.substring(string.indexOf(end));
    }

    static removeEmptyElementsFilter(elem) {
        return Boolean(elem);
    }

    static safeConcat(first, second, delimiter) {
        if(!delimiter) delimiter = '\n';
        first = first.trim().replace(/\t/g, "").split(delimiter).filter(Utils.removeEmptyElementsFilter);
        second = second.trim().replace(/\t/g, "").split(delimiter).filter(Utils.removeEmptyElementsFilter);
        first = first.filter((value) => {
            return second.indexOf(value) == -1
        });

        return '\n' + first.concat(second).join(delimiter) + '\n';
    }
}

module.exports = Utils;