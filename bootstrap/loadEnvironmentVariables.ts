const Env = require('dotenv')
const path = require('path')
/**
 * Class LoadEnvironmentVariables.
 */
class LoadEnvironmentVariables {

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app: any) {

        Env.config({
            path: path.normalize(path.join($app.environmentPath(), $app.environmentFile()))
        })

    }

}
module.exports = LoadEnvironmentVariables