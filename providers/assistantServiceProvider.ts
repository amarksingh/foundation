const ServiceProvider = require('@ostro/support/serviceProvider');

/**
 * Class AssistantServiceProvider.
 */
class AssistantServiceProvider extends ServiceProvider {
    $commands = {
        'DbQuery': 'command.db.query',
        'KeyGenerate': 'command.key.generate',
        'Seed': 'command.seed',
        'StorageLink': 'command.storage.link',
        'CacheClear': 'command.cache.clear',
        'CacheForget': 'command.cache.forget',
        'DbWipe': 'command.db.wipe',
    };

    $devCommands = {
        'CacheTable': 'command.cache.table',
        'ConsoleMake': 'command.console.make',
        'ControllerMake': 'command.controller.make',
        'FactoryMake': 'command.factory.make',
        'MiddlewareMake': 'command.middleware.make',
        'ModelMake': 'command.model.make',
        'ResourceMake': 'command.resource.make',
        'SeederMake': 'command.seeder.make',
        'SessionTable': 'command.session.table',
        'ServerlessBootstrap': 'command.serverless.bootstrap',
        'ServerBootstrap': 'command.server.bootstrap',
    };

    /**
     * register method.
     * @returns {any}
     */
    register() {
        this.registerCommands(Object.assign(
            this.$commands, this.$devCommands
        ));
    }

    /**
     * registerCommands method.
     * @param {*} $commands
     * @returns {any}
     */
    registerCommands($commands: Record<string, any> = {}) {
        for (let $command of Object.keys($commands)) {
            if (typeof this[`register${$command}Command`] != 'function') {
                throw new Error(`register${$command}Command not available.`)
            }
            this[`register${$command}Command`]();
        }

        this.commands(Object.values($commands));
    }

    /**
     * registerDbQueryCommand method.
     * @returns {any}
     */
    registerDbQueryCommand() {
        this.$app.singleton('command.db.query', function ($app) {
            let $table = $app['config']['database.table'];
            return new (require('@ostro/database/console/databaseQuery'))($app['db'], $table);
        });
    }

    /**
     * registerSeederMakeCommand method.
     * @returns {any}
     */
    registerSeederMakeCommand() {
        this.$app.singleton('command.seeder.make', function ($app) {
            return new (require('@ostro/database/console/seeds/seederMakeCommand'))($app['files']);
        });
    }

    /**
     * registerSeedCommand method.
     * @returns {any}
     */
    registerSeedCommand() {
        this.$app.singleton('command.seed', function ($app) {
            return new (require('@ostro/database/console/seeds/seedCommand'))($app['db']);
        });
    }

    /**
     * registerCacheClearCommand method.
     * @returns {any}
     */
    registerCacheClearCommand() {
        this.$app.singleton('command.cache.clear', function ($app) {
            return new (require('@ostro/cache/console/clearCommand'))($app['cache'], $app['files']);
        });
    }

    /**
     * registerCacheForgetCommand method.
     * @returns {any}
     */
    registerCacheForgetCommand() {
        this.$app.singleton('command.cache.forget', function ($app) {
            return new (require('@ostro/cache/console/forgetCommand'))($app['cache']);
        });
    }

    /**
     * registerCacheTableCommand method.
     * @returns {any}
     */
    registerCacheTableCommand() {
        this.$app.singleton('command.cache.table', function ($app) {
            return new (require('@ostro/cache/console/cacheTableCommand'))($app['files']);
        });
    }

    /**
     * registerConsoleMakeCommand method.
     * @returns {any}
     */
    registerConsoleMakeCommand() {
        this.$app.singleton('command.console.make', function ($app) {
            return new (require('@ostro/foundation/console/consoleMakeCommand'))($app['files']);
        });
    }

    /**
     * registerControllerMakeCommand method.
     * @returns {any}
     */
    registerControllerMakeCommand() {
        this.$app.singleton('command.controller.make', function ($app) {
            return new (require('@ostro/router/console/controllerMakeCommand'))($app['files']);
        });
    }

    /**
     * registerFactoryMakeCommand method.
     * @returns {any}
     */
    registerFactoryMakeCommand() {
        this.$app.singleton('command.factory.make', function ($app) {
            return new (require('@ostro/database/console/factories/factoryMakeCommand'))($app['files']);
        });
    }

    /**
     * registerKeyGenerateCommand method.
     * @returns {any}
     */
    registerKeyGenerateCommand() {
        this.$app.singleton('command.key.generate', function ($app) {
            return new (require('@ostro/foundation/console/keyGenerateCommand'))($app['files']);
        });
    }

    /**
     * registerMiddlewareMakeCommand method.
     * @returns {any}
     */
    registerMiddlewareMakeCommand() {
        this.$app.singleton('command.middleware.make', function ($app) {
            return new (require('@ostro/router/console/middlewareMakeCommand'))($app['files']);
        });
    }

    /**
     * registerModelMakeCommand method.
     * @returns {any}
     */
    registerModelMakeCommand() {
        this.$app.singleton('command.model.make', function ($app) {
            return new (require('@ostro/foundation/console/modelMakeCommand'))($app['files']);
        });
    }

    /**
     * registerResourceMakeCommand method.
     * @returns {any}
     */
    registerResourceMakeCommand() {
        this.$app.singleton('command.resource.make', function ($app) {
            return new (require('@ostro/foundation/console/resourceMakeCommand'))($app['files']);
        });
    }

    /**
     * registerSessionTableCommand method.
     * @returns {any}
     */
    registerSessionTableCommand() {
        this.$app.singleton('command.session.table', function ($app) {
            return new (require('@ostro/session/console/sessionTableCommand'))($app['files']);
        });
    }

    /**
     * registerStorageLinkCommand method.
     * @returns {any}
     */
    registerStorageLinkCommand() {
        this.$app.singleton('command.storage.link', function ($app) {
            return new (require('@ostro/foundation/console/storageLinkCommand'))($app['files']);
        });
    }

    /**
     * registerServerlessBootstrapCommand method.
     * @returns {any}
     */
    registerServerlessBootstrapCommand() {
        this.$app.singleton('command.serverless.bootstrap', function ($app) {
            return new (require('@ostro/foundation/console/serverlessBootstrapCommand'))($app['files']);
        });
    }

    /**
     * registerServerBootstrapCommand method.
     * @returns {any}
     */
    registerServerBootstrapCommand() {
        this.$app.singleton('command.server.bootstrap', function ($app) {
            return new (require('@ostro/foundation/console/serverBootstrapCommand'))($app['files']);
        });
    }

    /**
     * registerDbWipeCommand method.
     * @returns {any}
     */
    registerDbWipeCommand() {
        this.$app.singleton('command.db.wipe', function () {
            return new (require('@ostro/database/console/wipeCommand'));
        });
    }

    /**
     * provides method.
     * @returns {any}
     */
    provides() {
        return Object.values(this.$commands);
    }

}

module.exports = AssistantServiceProvider