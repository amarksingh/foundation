const tokens = require('csrf')()
const TokenMismatchException = require('@ostro/http/exception/tokenMismatchException')
/**
 * Class VerifyCsrfToken.
 */
class VerifyCsrfToken {
    
    $cookieName = 'XSRF-TOKEN';

    $addHttpCookie = true;

    $except = [
        //
    ];

    /**
     * handle method.
     * @param {*} { request
     * @param {*} response }
     * @param {*} next
     * @returns {any}
     */
    handle({ request, response }: Record<string, any>, next: Function) {
        if (
            this.isReading(request) ||
            this.inExceptArray(request) ||
            this.tokensMatch(request)
        ) {
            if (this.shouldAddXsrfTokenCookie()) {
                this.addCookieToResponse(request, response);
            }
            next()
        } else {
            next(new TokenMismatchException('CSRF token mismatch.'))
        }
    }

    /**
     * addCookieToResponse method.
     * @param {*} request
     * @param {*} response
     * @returns {any}
     */
    addCookieToResponse(request: any, response: any) {
        request.cookie.set(this.$cookieName, request.session.token(), { httpOnly: false })

    }

    /**
     * inExceptArray method.
     * @param {*} $request
     * @returns {any}
     */
    inExceptArray($request: any) {
        for (let $except of this.$except) {
            if ($request.fullUrlIs($except)) {
                return true;
            }
        }

        return false;
    }

    /**
     * tokensMatch method.
     * @param {*} $request
     * @returns {any}
     */
    tokensMatch($request: any) {
        let $token = this.getTokenFromRequest($request);
        return (typeof $request.session.token() == 'string') &&
            (typeof $token == 'string') &&
            tokens.verify(this.$app.config['app']['key'], $token);
    }

    /**
     * getTokenFromRequest method.
     * @param {*} $request
     * @returns {any}
     */
    getTokenFromRequest($request: any) {
        let $token = $request.input('_token') ? $request.input('_token') : $request.header('X-CSRF-TOKEN');
        let $header = $request.header('X-XSRF-TOKEN')
        if (!$token && $header) {
            $token = $header
        }

        return $token;
    }

    /**
     * shouldAddXsrfTokenCookie method.
     * @returns {any}
     */
    shouldAddXsrfTokenCookie() {
        return this.$addHttpCookie;
    }

    /**
     * isReading method.
     * @param {*} $request
     * @returns {any}
     */
    isReading($request: any) {
        return ['HEAD', 'GET', 'OPTIONS'].includes($request.method);
    }

}

module.exports = VerifyCsrfToken