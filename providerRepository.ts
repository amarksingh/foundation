/**
 * Class ProviderRepository.
 */
class ProviderRepository {

    /**
     * Create a new instance.
     * @param {*} $app
     * @param {*} $files
     */
    constructor($app, $files) {
        this.$app = $app;
        this.$files = $files;
    }

    /**
     * load method.
     * @param {*} $providers
     * @returns {any}
     */
    load($providers) {

        let $manifest = this.compileManifest($providers);

        for (let $provider of $manifest['eager']) {
            this.$app.register($provider);
        }

        this.$app.addDeferredServices($manifest['deferred']);
    }

    /**
     * loadManifest method.
     * @returns {any}
     */
    loadManifest() {

    }

    /**
     * compileManifest method.
     * @param {*} $providers
     * @returns {any}
     */
    compileManifest($providers) {

        let $manifest = this.freshManifest($providers);

        for (let $provider of $providers) {

            let $instance = this.createProvider($provider);

            if ($instance.isDeferred()) {
                $manifest['deferred'].push($provider)
            } else {
                $manifest['eager'].push($provider);
            }
        }

        return this.writeManifest($manifest);
    }

    /**
     * freshManifest method.
     * @param {*} $providers
     * @returns {any}
     */
    freshManifest($providers) {
        return {
            'providers': $providers,
            'eager': [],
            'deferred': []
        };
    }

    /**
     * writeManifest method.
     * @param {*} $manifest
     * @returns {any}
     */
    writeManifest($manifest) {

        return $manifest
    }

    /**
     * createProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    createProvider($provider) {
        return new $provider(this.$app);
    }
}

module.exports = ProviderRepository