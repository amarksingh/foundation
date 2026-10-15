/**
 * Class BootProviders.
 */
class BootProviders {

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app) {
        $app.boot();
    }
}

module.exports = BootProviders