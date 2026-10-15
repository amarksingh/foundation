/**
 * Class RegisterProviders.
 */
class RegisterProviders {

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app) {
        $app.registerConfiguredProviders();
    }
}

module.exports = RegisterProviders