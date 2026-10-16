import ViewException from './viewException';
import ViewHelpers from './helpers';

/**
 * Class View.
 */
class View {
    /**
     * Create a new instance.
     * @param app - Application instance
     * @param http - Http context
     * @param next - Next middleware callback
     */
    constructor(app: any, http: any, next: Function) {
        const context: Record<string, any> = {};
        Object.assign(context, (app['locals'] || {}));
        Object.assign(context, global);
        context.request = http.request;
        context.session = http.session;
        context.helpers = new ViewHelpers(app, http);

        const fn: any = function (file: string, data: any = {}, status: number = 200) {
            fn.render(...arguments);
            return http.response;
        };

        fn.engine = function (engine: string) {
            Object.defineProperty(http.response, '__viewEngine', {
                value: engine,
                configurable: false,
                writable: false,
                enumerable: false
            });
            return this;
        };

        fn.render = function (file: string, data: any = {}, status: number = 200) {
            Object.assign(data, context);

            app.view.engine(http.response.__viewEngine).renderFile(file, data, async (data: any) => {
                Promise.resolve(data)
                    .then(res => {
                        if (typeof res === 'object' && (res instanceof Promise) === false) {
                            throw (new ViewException(res));
                        }
                        http.response.send(res, status);
                    })
                    .catch(e => {
                        next(e);
                    });
            });
            return http.response;
        };

        return fn;
    }
}

export = View;