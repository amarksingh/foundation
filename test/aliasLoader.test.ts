const AliasLoader = require('../aliasLoader');
const path = require('path');

describe('AliasLoader', () => {
    afterEach(() => {
        delete global.CustomAlias1;
        delete global.CustomAlias2;
        delete global.CustomRelative;
    });

    test('registers aliases directly and by path', () => {
        const dummyObj = { test: true };
        const loader = new AliasLoader({
            CustomAlias1: dummyObj,
            CustomAlias2: 'path'
        });
        loader.registerGlobal();

        expect(global.CustomAlias1).toBe(dummyObj);
        expect(global.CustomAlias2).toBe(path);
    });

    test('registers relative path alias', () => {
        const loader = new AliasLoader({
            CustomRelative: './aliasLoader.js'
        });
        loader.registerGlobal();

        expect(global.CustomRelative).toBe(AliasLoader);
    });

    test('default empty constructor', () => {
        const loader = new AliasLoader();
        expect(loader._aliases).toEqual([]);
        expect(() => loader.registerGlobal()).not.toThrow();
    });
});
