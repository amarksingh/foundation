require('@ostro/support/helpers');
const AssistantServiceProvider = require('../providers/assistantServiceProvider');

describe('AssistantServiceProvider', () => {
    test('registers all commands and provides', () => {
        const singletons = {};
        const appMock = {
            singleton: (name, factory) => {
                singletons[name] = factory;
            },
            config: {
                'database.table': 'migrations'
            },
            db: {},
            files: {},
            cache: {}
        };

        const provider = new AssistantServiceProvider(appMock);
        provider.register();

        expect(provider.provides()).toEqual(Object.values(provider.$commands));

        // Test every registered singleton factory
        const allCommands = Object.assign({}, provider.$commands, provider.$devCommands);
        for (const [key, cmdName] of Object.entries(allCommands)) {
            expect(typeof singletons[cmdName]).toBe('function');
            const instance = singletons[cmdName](appMock);
            expect(instance).toBeDefined();
        }

        // Test error when command method is missing
        expect(() => {
            provider.registerCommands({ 'NonExistent': 'command.non.existent' });
        }).toThrow('registerNonExistentCommand not available.');

        // Default empty commands call
        provider.registerCommands();
    });
});
