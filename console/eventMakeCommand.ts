const GeneratorCommand = require('@ostro/console/generatorCommand')

/**
 * Class EventMakeCommand.
 */
class EventMakeCommand extends GeneratorCommand {

    $signature = 'make:event';

    $description = 'Create a new event class';

    $type = 'Event';

    /**
     * alreadyExists method.
     * @param {*} $rawName
     * @returns {any}
     */
    alreadyExists($rawName) {
        return this.$file.exists(this.getPath(this.qualifyClass($rawName)));
    }

    /**
     * getStub method.
     * @returns {any}
     */
    getStub() {
        return this.resolveStubPath('/stubs/event.stub');
    }

    /**
     * resolveStubPath method.
     * @async
     * @param {*} $stub
     * @returns {any}
     */
    async resolveStubPath($stub) {
        let $customPath = this.$app.basePath(trim($stub, '/'))
        return await this.$file.exists($customPath) ?
            $customPath :
            __dirname + $stub;
    }

    /**
     * getDefaultNamespace method.
     * @param {*} $rootNamespace
     * @returns {any}
     */
    getDefaultNamespace($rootNamespace) {
        return path.join($rootNamespace, 'app', 'events');
    }
}

module.exports = EventMakeCommand