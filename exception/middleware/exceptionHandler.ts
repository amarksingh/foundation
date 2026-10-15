/**
 * Class ExceptionHandler.
 */
class ExceptionHandler {
    /**
     * Create a new instance.
     */
    constructor() {
        this.$exceptionHandler = this.$app.make('@ostro/contracts/exception/handler')
    }
    /**
     * handle method.
     * @param {*} error
     * @param {*} { request
     * @param {*} response }
     * @param {*} next
     * @returns {any}
     */
    handle(error, { request, response },next) {
        this.$exceptionHandler.handler(((request.ajax() || request.wantJson()) ? 'json' : 'whoops')).handle(
            request,
            response,
            error
        )
    }
    /**
     * terminate method.
     * @param {*} error
     * @param {*} {request
     * @param {*} response}
     * @param {*} next
     * @returns {any}
     */
    terminate(error, {request,response} ,next){
        this.$exceptionHandler.handler('json').terminate(
            request,
            response,
            error
        )
    }
}

module.exports = ExceptionHandler
