/**
 * Class ProviderRepository.
 */
class ProviderRepository {

    /**
     * Create a new instance.
     * @param {*} $app
     * @param {*} $files
     */
    constructor($app: any, $files: any) {
        this.$app = $app;
        this.$files = $files;
    }

    /**
     * load method.
     * @param {*} $providers
     * @returns {any}
     */
    load($providers: any) {

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
    compileManifest($providers: any) {

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
    freshManifest($providers: any) {
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
    writeManifest($manifest: any) {

        return $manifest
    }

    /**
     * createProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    createProvider($provider: any) {
        return new $provider(this.$app);
    }
}

module.exports = ProviderRepository