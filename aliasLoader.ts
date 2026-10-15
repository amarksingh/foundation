const path = require('path')
/**
 * Class AliasLoader.
 */
class AliasLoader {

    /**
     * Create a new instance.
     * @param {*} aliases
     */
    constructor(aliases = []) {
        this._aliases = aliases
    }
    /**
     * registerGlobal method.
     * @returns {any}
     */
    registerGlobal() {
        let aliases = this._aliases
        for (let aliasKey in aliases) {
            global[aliasKey] = typeof aliases[aliasKey] == 'string' ? require((aliases[aliasKey].startsWith('./')) ? path.resolve(aliases[aliasKey]) : aliases[aliasKey]) : aliases[aliasKey]
        }
    }
}
module.exports = AliasLoader