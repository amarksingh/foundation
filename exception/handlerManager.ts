require('@ostro/support/helpers')
const {
    Macroable
} = require('@ostro/support/macro')
const kApp = Symbol('app')
const kHandlers = Symbol('handlers')
const kCustomHandlers = Symbol('customHandlers')
const kHandlerAdapter = Symbol('handlerAdapter')
const InvalidArgumentException = require('@ostro/support/exceptions/invalidArgumentException')
/**
 * Class ExceptionManager.
 */
class ExceptionManager extends Macroable {
    /**
     * Create a new instance.
     * @param {*} handler
     */
    constructor(handler: Function) {
        super()
        Object.defineProperties(this, {
            [kHandlerAdapter]: {
                value: handler,
                writable: true,
            },
            [kHandlers]: {
                value: Object.create(null),
                writable: true,
            },
            [kCustomHandlers]: {
                value: Object.create(null),
                writable: true,
            },
        })
    }

    /**
     * handler method.
     * @param {*} name
     * @returns {any}
     */
    handler(name: string = 'whoops') {
        name = (this.getConfig('app.debug') == false) ? 'production' : name

        return this[kHandlers][name] = this.get(name);
    }

    /**
     * get method.
     * @param {*} name
     * @returns {any}
     */
    get(name: string) {
        return this[kHandlers][name] || this.resolve(name);
    }

    /**
     * resolve method.
     * @param {*} name
     * @returns {any}
     */
    resolve(name: string) {
        let driverMethod = 'create' + (name.ucfirst()) + 'Handler';
        if ((this[kCustomHandlers][name])) {
            return this.callCustomHandler(name);
        } else if (typeof ExceptionManager.prototype[driverMethod] == 'function') {
            return this[driverMethod]();
        } else {
            throw new Error(`Handler [{${name}}] do not supported.`);
        }
    }

    /**
     * callCustomHandler method.
     * @param {*} name
     * @returns {any}
     */
    callCustomHandler(name: string) {
        var driver = this[kCustomHandlers][name]();
        return this.adapt(driver);
    }

    /**
     * createWhoopsHandler method.
     * @param {*} $config
     * @returns {any}
     */
    createWhoopsHandler($config: Record<string, any>) {
        return this.adapt(new(require('./handlers/whoops')));
    }

    /**
     * createProductionHandler method.
     * @returns {any}
     */
    createProductionHandler() {
        return this.adapt(new(require('./handlers/production')));
    }

    /**
     * createJsonHandler method.
     * @returns {any}
     */
    createJsonHandler() {
        return this.adapt(new(require('./handlers/json')));
    }

    /**
     * adapt method.
     * @param {*} handler
     * @returns {any}
     */
    adapt(handler: Function) {
        if (typeof this[kHandlerAdapter] != 'function') {
            throw new InvalidArgumentException('Invalid handler class on exception')
        }
        return new this[kHandlerAdapter](handler)
    }

    /**
     * getConfig method.
     * @param {*} key
     * @returns {any}
     */
    getConfig(key: string) {
        return this.$app['config'][key]
    }

    /**
     * setHandlerAdapter method.
     * @param {*} handler
     * @returns {any}
     */
    setHandlerAdapter(handler: Function) {
        this[kHandlerAdapter] = handler
    }

    /**
     * extend method.
     * @param {*} $driver
     * @param {*} $callback
     * @returns {any}
     */
    extend($driver: any, $callback: Function) {
        this[kCustomHandlers][$driver] = $callback.bind(this, this);
        return this;
    }
    /**
     * extends method.
     * @param {*} $driver
     * @param {*} $callback
     * @returns {any}
     */
    extends($driver: any, $callback: Function) {
        return this.extend($driver, $callback);
    }
    /**
     * __call method.
     * @param {*} target
     * @param {*} method
     * @param {*} args
     * @returns {any}
     */
    __call(target: Record<string, any>, method: string, args: any[]) {
        return target.handler()[method](...args)
    }
}
module.exports = ExceptionManager