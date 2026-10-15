/**
 * Class ValidatesRequests.
 */
class ValidatesRequests {

    /**
     * validate method.
     * @param {*} $request
     * @param {*} $rules
     * @param {*} $messages
     * @param {*} $customAttributes
     * @returns {any}
     */
    validate($request, $rules, $messages = [], $customAttributes = []) {
        return this.getValidationFactory().validate(
            $request.all(), $rules, $messages, $customAttributes
        )
    }

    validateWithBag($errorBag, $request, $rules,
        $messages = [], $customAttributes = []) {
        return this.validate($request, $rules, $messages, $customAttributes).catch($e => {
            $e.errorBag = $errorBag;
            return Promise.reject($e)
        })

    }

    /**
     * getValidationFactory method.
     * @returns {any}
     */
    getValidationFactory() {
        return app('validation');
    }
}

module.exports = ValidatesRequests