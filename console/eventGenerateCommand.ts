const Command = require('@ostro/console/command')
const EventServiceProvider = require('@ostro/event/eventServiceProvider')
/**
 * Class EventGenerateCommand.
 */
class EventGenerateCommand extends Command {

    $signature = 'event:generate';

    $description = 'Generate the missing events and listeners based on registration';

    /**
     * handle method.
     * @async
     * @returns {any}
     */
    async handle() {

        this.info('Events and listeners generated successfully!');
    }

    /**
     * makeEventAndListeners method.
     * @param {*} $event
     * @param {*} $listeners
     * @returns {any}
     */
    makeEventAndListeners($event, $listeners) {
        if (!$event.includes('\\')) {
            return;
        }

        this.callSilent('make:event', { 'name': $event });

        this.makeListeners($event, $listeners);
    }

    /**
     * makeListeners method.
     * @param {*} $event
     * @param {*} $listeners
     * @returns {any}
     */
    makeListeners($event, $listeners) {
        for (let $listener of $listeners) {
            $listener = $listener.replace(/@.+$/, '');

            this.callSilent('make:listener', Object.filter({ 'name': $listener, '--event': $event }));
        }
    }
}

module.exports = EventGenerateCommand