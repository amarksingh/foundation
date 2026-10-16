import Container from '@ostro/container';
import Filesystem from '@ostro/filesystem/filesystem';
import ProviderRepository from './providerRepository';
import Env from '@ostro/support/env';
import path from 'path';
import fs from 'fs';
import Mix from './mix';
import LocaleUpdated from './events/localeUpdated';
import worker_threads from 'worker_threads';
/**
 * Class Application.
 */
class Application extends Container {

    /**
     * Get VERSION.
     * @returns {any}
     */
    get VERSION() {
        return '1.1.5';
    }

    _basePath;

    _hasBeenBootstrapped = false;

    _booted = false;

    _serviceProviders = [];

    _deferredServices = [];

    _bootingCallbacks = [];

    /**
     * booting method.
     * @param {*} callback
     * @returns {any}
     */
    booting(callback: Function) {
        this._bootingCallbacks.push(callback);
    }

    _loadedProviders = [];

    _appPath;

    _databasePath;

    _langPath;

    _storagePath;

    _environmentPath;

    _environmentFile;

    /**
     * Create a new instance.
     * @param {*} basePath
     */
    constructor(basePath: any = null) {
        super()

        if (basePath) {
            this.setBasePath(basePath);
        }

        this.registerBaseBindings();
        this.registerBaseServiceProviders();

        global.app = this.app.bind(this)
    }

    /**
     * version method.
     * @returns {any}
     */
    version() {
        return this.VERSION;
    }

    /**
     * registerBaseBindings method.
     * @returns {any}
     */
    registerBaseBindings() {
        this.instance('app', this);
        this.singleton('mix', function (app) {
            return new Mix(app)
        });

    }

    /**
     * bootstrapWith method.
     * @param {*} $bootstrappers
     * @returns {any}
     */
    bootstrapWith($bootstrappers: any) {
        this._hasBeenBootstrapped = true;

        for (let $bootstrapper of $bootstrappers) {
            this.make($bootstrapper).bootstrap(this);
        }
    }

    /**
     * registerBaseServiceProviders method.
     * @returns {any}
     */
    registerBaseServiceProviders() {
        this.register('@ostro/logger/logServiceProvider');

    }

    /**
     * registerConfiguredProviders method.
     * @returns {any}
     */
    registerConfiguredProviders() {
        let $providers = this.config['app.providers'];
        (new ProviderRepository(this, new Filesystem, this.getCachedServicesPath()))
            .load($providers);

    }

    /**
     * getDeferredServices method.
     * @returns {any}
     */
    getDeferredServices() {
        return this._deferredServices;
    }

    /**
     * setDeferredServices method.
     * @param {*} $services
     * @returns {any}
     */
    setDeferredServices($services: any) {
        this._deferredServices = $services;
    }

    /**
     * addDeferredServices method.
     * @param {*} $services
     * @returns {any}
     */
    addDeferredServices($services: any) {
        this._deferredServices = this._deferredServices.concat($services);
    }

    /**
     * isDeferredService method.
     * @param {*} $service
     * @returns {any}
     */
    isDeferredService($service: any) {
        return this._deferredServices.indexOf($service) > -1
    }

    /**
     * hasBeenBootstrapped method.
     * @returns {any}
     */
    hasBeenBootstrapped() {
        return this._hasBeenBootstrapped;
    }

    /**
     * setBasePath method.
     * @param {*} basePath
     * @returns {any}
     */
    setBasePath(basePath: any) {
        this._basePath = path.resolve(basePath);
        if (worker_threads.isMainThread) {
            process.chdir(this._basePath);
        } else {
            globalThis.APP_BASE_PATH = this._basePath;
        }

        this.bindPathsInContainer();

        return this;
    }

    /**
     * bindPathsInContainer method.
     * @returns {any}
     */
    bindPathsInContainer() {
        this.instance('path', this.path());
        this.instance('path.base', this.basePath());
        this.instance('path.lang', this.langPath());
        this.instance('path.config', this.configPath());
        this.instance('path.public', this.publicPath());
        this.instance('path.storage', this.storagePath());
        this.instance('path.database', this.databasePath());
        this.instance('path.resources', this.resourcePath());
        this.instance('path.bootstrap', this.bootstrapPath());
    }

    /**
     * isBooted method.
     * @returns {any}
     */
    isBooted() {
        return this._booted;
    }

    /**
     * boot method.
     * @returns {any}
     */
    boot() {
        let app = this.instance('config').get('app')
        process.env.TZ = app.timezone
        process.env.NODE_ENV = app.env
        this._bootingCallbacks.forEach(callback => callback(this));
        this._serviceProviders.map(($p) => {
            this.bootProvider($p);
        });
        this._booted = true;

    }

    /**
     * register method.
     * @param {*} $provider
     * @param {*} $force
     * @returns {any}
     */
    register($provider: any, $force: boolean = false) {
        if (typeof $provider == 'string') {
            const mod = require(path.normalize($provider.startsWith('./') ? path.resolve($provider) : $provider));
            $provider = mod.default || mod;
        }
        let $registered = this.getProvider($provider)
        if ($registered && !$force) {
            return $registered;
        }

        $provider = this.resolveProvider($provider);

        $provider.register();

        this.markAsRegistered($provider);

        if (this.isBooted()) {
            this.bootProvider($provider);
        }

        return $provider;
    }

    /**
     * markAsRegistered method.
     * @param {*} $provider
     * @returns {any}
     */
    markAsRegistered($provider: any) {
        this._serviceProviders.push($provider);

    }

    /**
     * getProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    getProvider($provider: any) {
        return this.getProviders($provider)
    }

    /**
     * getProviders method.
     * @param {*} $provider
     * @returns {any}
     */
    getProviders($provider: any) {

        return this._serviceProviders.find(function (value) {
            return value instanceof $provider
        })
    }

    /**
     * resolveProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    resolveProvider($provider: any) {
        $provider = $provider.default || $provider;
        return new $provider(this);
    }

    /**
     * bootProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    bootProvider($provider: any) {
        $provider.callBootingCallbacks();

        if (typeof $provider.boot == 'function') {
            $provider.boot(this)
        }

        $provider.callBootedCallbacks();
    }

    /**
     * loadDeferredProviders method.
     * @returns {any}
     */
    loadDeferredProviders() {

        for (let $provider of this._deferredServices) {
            this.loadDeferredProvider($provider);
        }

        this._deferredServices = [];
    }

    /**
     * loadDeferredProvider method.
     * @param {*} $provider
     * @returns {any}
     */
    loadDeferredProvider($provider: any) {
        if (!this.isDeferredService($provider)) {
            return;
        }

        this.registerDeferredProvider($provider);

    }

    /**
     * registerDeferredProvider method.
     * @param {*} $provider
     * @param {*} $service
     * @returns {any}
     */
    registerDeferredProvider($provider: any, $service: any = null) {

        let instance = this.register($provider);

        if (!this.isBooted()) {
            this.booting(() => {
                this.bootProvider(instance);
            });
        }
    }

    /**
     * path method.
     * @param {*} dir
     * @returns {any}
     */
    path(dir: string = '') {
        let appPath = this._appPath ? this._appPath : path.normalize(path.join(this._basePath, 'app'));

        return path.normalize(path.join(appPath + dir));
    }

    /**
     * useAppPath method.
     * @param {*} dir
     * @returns {any}
     */
    useAppPath(dir: any) {
        this._appPath = dir;

        this.instance('path', dir);

        return this;
    }

    /**
     * basePath method.
     * @param {*} dir
     * @returns {any}
     */
    basePath(dir: string = '') {
        return path.normalize(path.join(this._basePath, dir))
    }

    /**
     * bootstrapPath method.
     * @param {*} dir
     * @returns {any}
     */
    bootstrapPath(dir: string = '') {
        return path.normalize(path.join(this._basePath, 'bootstrap', dir));
    }

    /**
     * configPath method.
     * @param {*} dir
     * @returns {any}
     */
    configPath(dir: string = '') {
        return path.normalize(path.join(this._basePath, 'config', dir));
    }

    /**
     * databasePath method.
     * @param {*} dir
     * @returns {any}
     */
    databasePath(dir: string = '') {
        return path.normalize(path.join((this._databasePath ? this._databasePath : path.join(this._basePath, 'database')), dir));
    }

    /**
     * useDatabasePath method.
     * @param {*} dir
     * @returns {any}
     */
    useDatabasePath(dir: any) {
        this._databasePath = dir;

        this.instance('path.database', dir);

        return this;
    }

    /**
     * langPath method.
     * @returns {any}
     */
    langPath() {
        if (this._langPath) {
            return this._langPath;
        }
        let dir = path.normalize(path.join(this.resourcePath(), 'lang'))
        if (!!path.extname(dir)) {
            return dir;
        }

        return path.normalize(path.join(this.basePath(), 'lang'));
    }

    /**
     * useLangPath method.
     * @param {*} dir
     * @returns {any}
     */
    useLangPath(dir: any) {
        this._langPath = dir;

        this.instance('path.lang', dir);

        return this;
    }

    /**
     * publicPath method.
     * @returns {any}
     */
    publicPath() {
        return path.normalize(path.join(this._basePath, 'public'));
    }

    /**
     * storagePath method.
     * @returns {any}
     */
    storagePath() {
        return this._storagePath ? this._storagePath : path.normalize(path.join(this._basePath, 'storage'));
    }

    /**
     * useStoragePath method.
     * @param {*} dir
     * @returns {any}
     */
    useStoragePath(dir: any) {
        this._storagePath = dir;

        this.instance('path.storage', dir);

        return this;
    }

    /**
     * resourcePath method.
     * @param {*} dir
     * @returns {any}
     */
    resourcePath(dir: string = '') {
        return path.normalize(path.join(this._basePath, 'resources', dir));
    }

    /**
     * viewPath method.
     * @param {*} dir
     * @returns {any}
     */
    viewPath(dir: string = '') {
        let basePath = this['config'] ? this['config'].get('view.paths', [])[0] : null;

        return path.normalize(path.join((basePath ? basePath : this._basePath + '/resources/view'), dir));
    }

    /**
     * environmentPath method.
     * @returns {any}
     */
    environmentPath() {
        return this._environmentPath ? this._environmentPath : this._basePath;
    }

    /**
     * useEnvironmentPath method.
     * @param {*} dir
     * @returns {any}
     */
    useEnvironmentPath(dir: any) {
        this._environmentPath = dir;

        return this;
    }

    /**
     * loadEnvironmentFrom method.
     * @param {*} file
     * @returns {any}
     */
    loadEnvironmentFrom(file: any) {
        this._environmentFile = file;

        return this;
    }

    /**
     * environmentFile method.
     * @returns {any}
     */
    environmentFile() {
        return this._environmentFile ? this._environmentFile : '.env';
    }

    /**
     * environmentFilePath method.
     * @returns {any}
     */
    environmentFilePath() {
        return path.normalize(path.join(this.environmentPath(), this.environmentFile()));
    }

    /**
     * isLocal method.
     * @returns {any}
     */
    isLocal() {
        return this['env'] === 'local';
    }

    /**
     * isProduction method.
     * @returns {any}
     */
    isProduction() {
        return this['env'] === 'production';
    }

    /**
     * isDownForMaintenance method.
     * @returns {any}
     */
    isDownForMaintenance() {
        return fs.existsSync(this.storagePath() + '/framework/down');
    }

    /**
     * getLocale method.
     * @returns {any}
     */
    getLocale() {
        return this['config'].get('app.locale');
    }

    /**
     * currentLocale method.
     * @returns {any}
     */
    currentLocale() {
        return this.getLocale();
    }

    /**
     * getFallbackLocale method.
     * @returns {any}
     */
    getFallbackLocale() {
        return this['config'].get('app.fallback_locale');
    }

    /**
     * setLocale method.
     * @param {*} locale
     * @returns {any}
     */
    setLocale(locale: any) {
        this['config'].set('app.locale', locale);

        this['translator'].setLocale(locale);

        this['events'].dispatch(new LocaleUpdated(locale));
    }

    /**
     * setFallbackLocale method.
     * @param {*} fallbackLocale
     * @returns {any}
     */
    setFallbackLocale(fallbackLocale: any) {
        this['config'].set('app.fallback_locale', fallbackLocale);

        this['translator'].setFallback(fallbackLocale);
    }

    /**
     * isLocale method.
     * @param {*} locale
     * @returns {any}
     */
    isLocale(locale: any) {
        return this.getLocale() == locale;
    }

    /**
     * getCachedServicesPath method.
     * @returns {any}
     */
    getCachedServicesPath() {
        return this.normalizeCachePath('APP_SERVICES_CACHE', 'cache/services.json');
    }

    /**
     * getCachedPackagesPath method.
     * @returns {any}
     */
    getCachedPackagesPath() {
        return this.normalizeCachePath('APP_PACKAGES_CACHE', 'cache/packages.json');
    }

    /**
     * configurationIsCached method.
     * @returns {any}
     */
    configurationIsCached() {
        return fs.existsSync(this.getCachedConfigPath());
    }

    /**
     * getCachedConfigPath method.
     * @returns {any}
     */
    getCachedConfigPath() {
        return this.normalizeCachePath('APP_CONFIG_CACHE', 'cache/config.json');
    }

    /**
     * routesAreCached method.
     * @returns {any}
     */
    routesAreCached() {
        return this['files'].exists(this.getCachedRoutesPath());
    }

    /**
     * getCachedRoutesPath method.
     * @returns {any}
     */
    getCachedRoutesPath() {
        return this.normalizeCachePath('APP_ROUTES_CACHE', 'cache/routes-v7.json');
    }

    /**
     * eventsAreCached method.
     * @returns {any}
     */
    eventsAreCached() {
        return this['files'].exists(this.getCachedEventsPath());
    }

    /**
     * getCachedEventsPath method.
     * @returns {any}
     */
    getCachedEventsPath() {
        return this.normalizeCachePath('APP_EVENTS_CACHE', 'cache/events.json');
    }

    /**
     * normalizeCachePath method.
     * @param {*} $key
     * @param {*} $default
     * @returns {any}
     */
    normalizeCachePath($key: string, $default: any) {
        let $env = Env.get($key)
        if ($env == null) {
            return this.bootstrapPath($default);
        }

        return $env.startsWith(this.absoluteCachePathPrefixes) ?
            $env :
            this.basePath($env);
    }

}

module.exports = Application
