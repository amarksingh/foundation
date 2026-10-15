/**
 * Class BootProviders.
 */
class BootProviders {

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app: any) {
        $app.boot();
    }
}

module.exports = BootProviders