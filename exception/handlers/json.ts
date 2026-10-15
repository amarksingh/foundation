const Ouch = require('ouch');
const kHandler = Symbol('handler')
/**
 * Class Json.
 */
class Json {
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
        return (new Ouch([new Ouch.handlers.JsonResponseHandler(false, true, false)]))
    }
    /**
     * render method.
     * @param {*} request
     * @param {*} response
     * @param {*} $exception
     * @returns {any}
     */
    render(request, response, $exception = {}) {
        this[kHandler].handleException($exception, null, null, function(exception) {
            let parsedObj = JSON.parse(exception).error || {}
            response.json({
                name: parsedObj.type,
                message: parsedObj.message,
                errors: ($exception.errors || {}),
                file: parsedObj.file,
                line: parsedObj.line,
                trace: parsedObj.trace,
            }, $exception.statusCode || 500)
        });
    }
}
module.exports = Json