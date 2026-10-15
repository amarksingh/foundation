const GeneratorCommand = require('@ostro/console/generatorCommand')
const StringHelper = require('@ostro/support/string')

/**
 * Class FactoryMakeCommand.
 */
class FactoryMakeCommand extends GeneratorCommand {

    $signature = 'make:command';

    $description =  'Create a new Assistant command';

    $options = [
        this.createOption('--command [command] ', 'The terminal command that should be assigned'),
    ];

    $arguments =  [
        this.createArgument('[name]', 'The name of the command').required()
    ];

    $type = 'Console command';

    /**
     * replaceClass method.
     * @param {*} $stub
     * @param {*} $name
     * @returns {any}
     */
    replaceClass($stub: any, $name: string) {
        $name = StringHelper.replaceAll($name, ':', ' ')
        $stub = super.replaceClass($stub, $name);
        let $command = this.option('command') || this.argument('name')
        return StringHelper.replaceAll($stub, ['dummy:command', '{{ command }}'], $command);
    }

    /**
     * getStub method.
     * @returns {any}
     */
    getStub() {
        return this.resolveStubPath('/stubs/console.stub');
    }

    /**
     * resolveStubPath method.
     * @param {*} $stub
     * @returns {any}
     */
    resolveStubPath($stub: any) {
        let $customPath = this.$app.basePath(trim($stub, '/'))
        return this.$file.exists($customPath).then($exists => ($exists ? $customPath : path.join(__dirname, $stub)))
    }

    /**
     * getDefaultNamespace method.
     * @param {*} $rootNamespace
     * @returns {any}
     */
    getDefaultNamespace($rootNamespace: any) {
        return path.join($rootNamespace, 'app', 'console', 'commands');
    }

}

module.exports = FactoryMakeCommand