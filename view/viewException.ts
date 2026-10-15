const ViewExceptionContract = require('@ostro/contracts/view/viewException')
/**
 * Class ViewException.
 */
class ViewException extends ViewExceptionContract {
    /**
     * Create a new instance.
     * @param {*} errors
     */
    constructor(errors) {
        super(errors);
        this.name = this.constructor.name;
        this.message = errors.message || errors;
        this.statusCode = 500;
        this.stack = errors.stack || (new Error()).stack;
    }
}
module.exports = ViewException