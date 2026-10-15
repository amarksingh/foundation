const Facade = require('@ostro/support/facades/facade')
const AliasLoader = require('@ostro/foundation/aliasLoader')
/**
 * Class RegisterFacades.
 */
class RegisterFacades {

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app: any) {
        Facade.setFacadeApplication($app);
        let aliasLoader = new AliasLoader($app.make('config').get('app.aliases', []))
        aliasLoader.registerGlobal()
    }
}
module.exports = RegisterFacades