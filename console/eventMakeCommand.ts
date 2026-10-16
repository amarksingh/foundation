import path from 'path';
import GeneratorCommand = require('@ostro/console/generatorCommand');
import { trim } from '@ostro/support/function';

/**
 * Class EventMakeCommand.
 */
class EventMakeCommand extends GeneratorCommand {

    public declare $app: any;
    public declare $file: any;

    public $signature: string = 'make:event';

    public $description: string = 'Create a new event class';

    public $type: string = 'Event';

    /**
     * alreadyExists method.
     * @param rawName - Raw name
     * @returns Promise resolving to boolean
     */
    public alreadyExists(rawName: string): Promise<boolean> {
        return this.$file.exists(this.getPath(this.qualifyClass(rawName)));
    }

    /**
     * getStub method.
     * @returns Promise resolving to stub path
     */
    public getStub(): Promise<string> {
        return this.resolveStubPath('/stubs/event.stub');
    }

    /**
     * resolveStubPath method.
     * @param stub - The relative stub path
     * @returns The resolved stub path
     */
    public async resolveStubPath(stub: string): Promise<string> {
        let customPath: string = this.$app.basePath(trim(stub, '/'));
        return (await this.$file.exists(customPath)) ?
            customPath :
            path.join(__dirname, stub);
    }

    /**
     * getDefaultNamespace method.
     * @param rootNamespace - Root namespace
     * @returns The default namespace path
     */
    public getDefaultNamespace(rootNamespace: string): string {
        return path.join(rootNamespace, 'app', 'events');
    }
}

export = EventMakeCommand;