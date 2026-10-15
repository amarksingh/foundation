const HttpContext = require('@ostro/http/httpContext')
/**
 * Class FoundationHttpContext.
 */
class FoundationHttpContext extends HttpContext {
    /**
     * Create a new instance.
     * @param {*} request
     * @param {*} response
     * @param {*} next
     */
    constructor(request: any, response: any, next: Function) {
        super(request, response, next)
    }

    /**
     * Get auth.
     * @returns {any}
     */
    get auth() {
        return this.request.auth
    }

    /**
     * Get view.
     * @returns {any}
     */
    get view() {
        return this.response.view
    }

    /**
     * Get session.
     * @returns {any}
     */
    get session() {
        return this.request.session
    }

    /**
     * Get params.
     * @returns {any}
     */
    get params() {
        return this.request.params
    }

    /**
     * csrf_token method.
     * @returns {any}
     */
    csrf_token() {
        return this.session.token() || ''
    }

    /**
     * csrfToken method.
     * @returns {any}
     */
    csrfToken() {
        return this.csrf_token()
    }

}

module.exports = FoundationHttpContext