const AggregateServiceProvider = require('@ostro/support/aggregateServiceProvider')
const Http = require('@ostro/http/httpContext')
const Request = require('@ostro/http/request')
const FileRequest = require('@ostro/http/file')

/**
 * Class FoundationServiceProvider.
 */
class FoundationServiceProvider extends AggregateServiceProvider {

    /**
     * register method.
     * @returns {any}
     */
    register() {
        super.register();

        this.registerRequestValidation();
    }

    /**
     * boot method.
     * @returns {any}
     */
    boot() {
        super.boot()
        this.requestFilesystem()
    }

    /**
     * registerRequestValidation method.
     * @returns {any}
     */
    registerRequestValidation() {
        let $app = this.$app

        Request.macro('validate', function($rules = {}, $message = {}) {
            return $app['validation'].validate(this.all(), $rules, $message)
        })
    }

    /**
     * requestFilesystem method.
     * @returns {any}
     */
    requestFilesystem() {
        this.$app.whenHas('filesystem', function(filesystem) {
            filesystem.registerToRequest(FileRequest)
        })
    }

}

module.exports = FoundationServiceProvider