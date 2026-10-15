const Ouch = require('ouch');
const kHandler = Symbol('handler')
/**
 * Class Whoops.
 */
class Whoops {
    /**
     * Create a new instance.
     */
    constructor() {
        this[kHandler] = this.register()
    }
    /**
     * register method.
     * @returns {any}
     */
    register() {
        return (new Ouch).pushHandler(new Ouch.handlers.PrettyPageHandler('orange'))
    }
    /**
     * render method.
     * @param {*} request
     * @param {*} response
     * @param {*} $exception
     * @returns {any}
     */
    render(request: any, response: any, $exception: Record<string, any> = {}) {
        if (!response.headersSent) {
            response.writeHead(($exception.statusCode || 500), {'Content-Type': 'text/html'});
        }
        this[kHandler].handleException($exception, request, response)
    }
}
module.exports = Whoops
