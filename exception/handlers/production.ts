const fs = require('fs')
const path = require('path')
/**
 * Class Production.
 */
class Production {

    /**
     * register method.
     * @returns {any}
     */
    register() {

    }
    /**
     * render method.
     * @param {*} request
     * @param {*} response
     * @param {*} $exception
     * @returns {any}
     */
    render(request: any, response: any, $exception: Record<string, any> = {}) {
        if (request.wantJson() || request.ajax()) {
            response.send({
                name: $exception.name || 'HttpException',
                errors: $exception.errors || {},
                message: $exception.message || 'Whoops look like somthing wrong'
            }, ($exception.statusCode || 500))
        } else {
            return fs.readFile(path.join(__dirname, '../template/errors/500'), { encoding: 'utf8' }, function(error, data) {
                response.send(data, 500)
            })
        }
    }
}
module.exports = Production