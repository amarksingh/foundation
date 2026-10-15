const kHttp = Symbol('http')
const kApp = Symbol('app')

/**
 * Class Helpers.
 */
class Helpers {
    /**
     * Create a new instance.
     * @param {*} app
     * @param {*} http
     */
    constructor(app, http) {
        Object.defineProperty(this, kHttp, {
            value: http,
            enumerable: false,
            configurable: false,
            writable: false
        })
        Object.defineProperty(this, kApp, {
            value: app,
            enumerable: false,
            configurable: false,
            writable: false
        })

    }

    /**
     * secure_asset method.
     * @param {*} $name
     * @returns {any}
     */
    secure_asset($name) {
        let domain = this[kApp].config.get('app.asset_url') || ('https://' + this[kHttp].request.get('host'))
        return new URL(path.join(...arguments), domain).href
    }

    /**
     * asset method.
     * @returns {any}
     */
    asset() {
        let domain = this[kApp].config.get('app.asset_url') || (this[kHttp].request.protocol() + '://' + this[kHttp].request.get('host'))
        return new URL(path.join(...arguments), domain).href
    }

    /**
     * session method.
     * @param {*} key
     * @returns {any}
     */
    session(key) {
        return this[kHttp].request.session.get(key)
    }

    /**
     * Get auth.
     * @returns {any}
     */
    get auth() {
        return this[kHttp].request.auth
    }

    /**
     * old method.
     * @param {*} key
     * @param {*} defaultValue
     * @returns {any}
     */
    old(key, defaultValue) {
        return this[kHttp].request.old(key, defaultValue)
    }

    /**
     * csrfToken method.
     * @returns {any}
     */
    csrfToken() {
        return this[kHttp].csrfToken()
    }

    /**
     * csrf_token method.
     * @returns {any}
     */
    csrf_token() {
        return this.csrfToken()
    }

    /**
     * Get error.
     * @returns {any}
     */
    get error() {
        return this[kHttp].request.error()
    }

    /**
     * route method.
     * @returns {any}
     */
    route() {
        return this[kApp]['router'].route(...arguments)
    }

    /**
     * mix method.
     * @param {*} path
     * @returns {any}
     */
    mix(path) {
        return this[kApp].mix.path(path)
    }

    /**
     * absolutePath method.
     * @returns {any}
     */
    absolutePath() {
        return this[kApp].config.get('app.url', '') + this[kHttp].request.path()
    }

}

module.exports = Helpers