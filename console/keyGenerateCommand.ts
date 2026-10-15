const Command = require('@ostro/console/command')
const Crypto = require('crypto')
/**
 * Class KeyGenerateCommand.
 */
class KeyGenerateCommand extends Command {

    $signature = 'key:generate';

    $description = 'Set the application key';

    $options = [
        this.createOption('--show [command] ', 'Display the key instead of modifying files'),
        this.createOption('--force [command] ', 'Force the operation to run when in production'),
    ];

    /**
     * Create a new instance.
     * @param {*} file
     */
    constructor(file) {
        super()
        this.$file = file
    }

    /**
     * handle method.
     * @async
     * @returns {any}
     */
    async handle() {
        let $key = this.generateRandomKey();

        if (this.option('show')) {
            return this.line('<comment>' + $key + '</comment>');
        }

        if (!await this.setKeyInEnvironmentFile($key)) {
            return;
        }

        this.$app['config']['app.key'] = $key;

        this.info('Application key set successfully.');
    }

    /**
     * generateRandomKey method.
     * @returns {any}
     */
    generateRandomKey() {
        let $cipher = this.$app['config']['app.cipher']
        let $length = $cipher == 'AES-128-CBC' ? 16 : ($cipher == 'AES-192-CBC' ? 24 : 32)
        return 'base64:' + Crypto.randomBytes($length).toString('base64');
    }

    /**
     * setKeyInEnvironmentFile method.
     * @async
     * @param {*} $key
     * @returns {any}
     */
    async setKeyInEnvironmentFile($key) {
        let $currentKey = this.$app['config']['app.key'];

        if ($currentKey.length !== 0 && (!await this.confirmToProceed())) {
            return false;
        }

        await this.writeNewEnvironmentFileWith($key);

        return true;
    }

    /**
     * writeNewEnvironmentFileWith method.
     * @param {*} $key
     * @returns {any}
     */
    writeNewEnvironmentFileWith($key) {
        return this.$file.get(this.$app.environmentFilePath()).then(res => {
            return this.$file.put(this.$app.environmentFilePath(), res.replace(this.keyReplacementPattern(), 'APP_KEY=' + $key))
        })
    }

    /**
     * keyReplacementPattern method.
     * @returns {any}
     */
    keyReplacementPattern() {

        return 'APP_KEY=' + this.$app['config']['app.key'];
    }
}

module.exports = KeyGenerateCommand