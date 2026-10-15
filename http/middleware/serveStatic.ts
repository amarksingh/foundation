const serveStatic = require('serve-static');
/**
 * Class ServeStatic.
 */
class ServeStatic {
    /**
     * Create a new instance.
     */
    constructor() {
        this.$publicPath = $app['path.public']
    }
    get $defaultOptions() {
        return {
            'maxAge': '180d'
        }
    }

    get $options(){
    	return {}
    }

    /**
     * handle method.
     * @param {*} { request
     * @param {*} response }
     * @param {*} next
     * @returns {any}
     */
    handle({ request, response }, next) {
        serveStatic(this.$publicPath, { ...this.$defaultOptions, ...this.$options })(request, response, next)
    }
}

module.exports = ServeStatic