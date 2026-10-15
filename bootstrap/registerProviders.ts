/**
 * Class RegisterProviders.
 */
class RegisterProviders {

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app: any) {
        $app.registerConfiguredProviders();
    }
}

module.exports = RegisterProviders