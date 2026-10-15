const View = require('../viewEngine')
/**
 * Class BindView.
 */
class BindView {

    /**
     * handle method.
     * @param {*} http
     * @param {*} next
     * @returns {any}
     */
    handle(http: any, next: Function) {
        http.response.view = new View(this.$app, http, next)
        next()

    }
}
module.exports = BindView