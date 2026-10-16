import path from 'path';
import GeneratorCommand = require('@ostro/console/generatorCommand');
import { trim } from '@ostro/support/function';

/**
 * Class ResourceMakeCommand.
 */
class ResourceMakeCommand extends GeneratorCommand {

    public declare $app: any;
    public declare $file: any;

    public $signature: string = 'make:resource';

    public $description: string = 'Create a new resource';

    public $type: string = 'Resource';

    public $options: any[] = [
        this.createOption('-c, --collection', 'Create a resource collection'),
    ];

    /**
     * handle method.
     * @returns Promise resolving when done
     */
    public async handle(): Promise<void> {
        if (this.collection()) {
            this.$type = 'Resource collection';
        }

        await super.handle();
    }

    /**
     * getStub method.
     * @returns Stub path
     */
    public getStub(): Promise<string> {
        return this.collection() ?
            this.resolveStubPath('/stubs/resource-collection.stub') :
            this.resolveStubPath('/stubs/resource.stub');
    }

    /**
     * collection method.
     * @returns Whether this is a resource collection
     */
    public collection(): boolean {
        return Boolean(this.option('collection') ||
            (String as any).endsWith(this.argument('name'), 'Collection'));
    }

    /**
     * resolveStubPath method.
     * @param stub - Relative stub path
     * @returns Resolved stub path
     */
    public async resolveStubPath(stub: string): Promise<string> {
        let customPath: string = this.$app.basePath(trim(stub, path.sep));
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
        return path.join(rootNamespace, 'app', 'http', 'resources');
    }

}

export = ResourceMakeCommand;