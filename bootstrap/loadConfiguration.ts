const Repository = require('@ostro/config/repository')
const fs = require('fs')
const path = require('path')
/**
 * Class LoadConfiguration.
 */
class LoadConfiguration {
    /**
     * Create a new instance.
     * @param {*} $app
     */
    constructor($app: any) {
        this.$app = $app
    }

    /**
     * bootstrap method.
     * @param {*} $app
     * @returns {any}
     */
    bootstrap($app: any) {
        let $items = [];
        let config = new Repository($items)
        $app.instance('config', config);
        this.loadConfigurationFiles($app, config);
        this.setTimezone(config['app']['timezone'])

    }

    /**
     * loadConfigurationFiles method.
     * @param {*} $app
     * @param {*} $repository
     * @returns {any}
     */
    loadConfigurationFiles($app: any, $repository: any) {
        let configPath = $app.configPath();
        let files = this.getConfigurationFiles(configPath);

        if (files.indexOf('app') < 0) {
            throw new Error('Unable to load the "app" configuration file.');
        }

        for (let key of files) {
            $repository.set(key, require(path.normalize(path.join(configPath, key))));
        }
    }

    /**
     * getConfigurationFiles method.
     * @param {*} configPath
     * @returns {any}
     */
    getConfigurationFiles(configPath: any) {
        let files = [];

        let configFiles = fs.readdirSync(configPath)
        for (let dir of configFiles) {
            let fileName = dir.substr(0, dir.indexOf('.'))
            if (configFiles[fileName]) {
                if (typeof configFiles[fileName] == 'object') {
                    files.push(configFiles[fileName])
                }
            } else {
                files.push(fileName)
            }
        }

        return files;
    }

    /**
     * setTimezone method.
     * @param {*} tz
     * @returns {any}
     */
    setTimezone(tz: any) {
        process.env.TZ = tz
    }

}
module.exports = LoadConfiguration