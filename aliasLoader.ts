import path from 'path';

/**
 * Class AliasLoader.
 */
class AliasLoader {
    public _aliases: Record<string, any> | any[];

    /**
     * Create a new instance.
     * @param aliases - Map or list of aliases
     */
    constructor(aliases: Record<string, any> | any[] = []) {
        this._aliases = aliases;
    }

    /**
     * registerGlobal method.
     */
    public registerGlobal(): void {
        const aliases = this._aliases as Record<string, any>;
        for (const aliasKey in aliases) {
            const target = typeof aliases[aliasKey] === 'string'
                ? require(aliases[aliasKey].startsWith('./') ? path.resolve(aliases[aliasKey]) : aliases[aliasKey])
                : aliases[aliasKey];
            (global as any)[aliasKey] = (target && target.default) ? target.default : target;
        }
    }
}

export default AliasLoader;