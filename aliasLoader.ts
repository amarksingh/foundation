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
            (global as any)[aliasKey] = typeof aliases[aliasKey] === 'string'
                ? require(aliases[aliasKey].startsWith('./') ? path.resolve(aliases[aliasKey]) : aliases[aliasKey])
                : aliases[aliasKey];
        }
    }
}

export = AliasLoader;