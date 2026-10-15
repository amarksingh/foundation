const HttpRequest = require('@ostro/http/request')
const CoreHttpRequest = require('../http/request')
const ServerRequest = require('@ostro/server/request')

/**
 * Class RequestBound.
 */
class RequestBound {

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app) {
        ServerRequest.prototype['app'] = $app
        for (let a of Object.getOwnPropertyNames(HttpRequest.prototype)) {
            ServerRequest.prototype[a] = HttpRequest.prototype[a];
        }
        for (let a of Object.getOwnPropertyNames(CoreHttpRequest.prototype)) {
            ServerRequest.prototype[a] = CoreHttpRequest.prototype[a];
        }

    }
}

module.exports = RequestBound