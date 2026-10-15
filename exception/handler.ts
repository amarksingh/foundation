const PageNotFoundException = require('@ostro/contracts/http/pageNotFoundException')
const validationException = require('@ostro/contracts/validation/validationException')
const TokenMismatchException = require('@ostro/contracts/http/tokenMismatchException')
const FileNotFoundException = require('@ostro/contracts/filesystem/fileNotFoundException')
const FileUploadException = require('@ostro/contracts/filesystem/fileUploadException')
const JsonException = require('@ostro/contracts/http/jsonException')
const Redirect = require('@ostro/contracts/http/redirectResponse')
const Session = require('@ostro/contracts/session/session')
const AuthenticationException = require('@ostro/auth/authenticationException')
const path = require('path')
const fs = require('fs')
const kHandle = Symbol('handle')
const kLogger = Symbol('logger')

/**
 * Class Handler.
 */
class Handler {
    $dontReport = [
        validationException,
        JsonException,
        Redirect,
        TokenMismatchException
    ];

    $dontFlash = [];

    /**
     * Create a new instance.
     * @param {*} handler
     */
    constructor(handler: Function) {
        this[kHandle] = handler
        this[kLogger] = app('logger')
    }

    /**
     * handle method.
     * @param {*} request
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    handle(request: any, response: any, $e: Record<string, any> = {}) {
        this.render(request, response, $e)
    }

    /**
     * terminate method.
     * @param {*} request
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    terminate(request: any, response: any, $e: Record<string, any> = {}) {
        this.report($e)
    }

    /**
     * render method.
     * @param {*} request
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    render(request: any, response: any, $e: Record<string, any> = {}) {
        if ($e instanceof PageNotFoundException) {
            this.pageNotFoundException(request, response, $e)
        } else if ($e instanceof validationException) {
            this.convertValidationExceptionToResponse(request, response, $e);
        } else if ($e instanceof TokenMismatchException) {
            this.tokenMismatchException(request, response, $e)
        } else if ($e instanceof AuthenticationException) {
            this.unauthenticated(request, response, $e);
        } else if ($e instanceof Redirect) {
            this.redirect(response, $e)
        } else if ($e instanceof FileNotFoundException) {
            response.send({
                name: $e.name,
                message: $e.message
            }, $e.statusCode)
        } else if ($e instanceof FileUploadException) {
            response.send({
                name: $e.name,
                message: $e.message
            }, $e.statusCode)
        } else if ($e instanceof JsonException) {
            response.send({
                name: $e.name,
                message: $e.message,
                errors: $e.errors
            }, $e.statusCode)
        } else if (typeof $e.message == 'object') {
            this[kHandle].render(
                request,
                response,
                $e
            )
        } else {
            this[kHandle].render(
                request,
                response,
                $e
            )
        }
        this.report($e)


    }

    /**
     * unauthenticated method.
     * @param {*} $request
     * @param {*} $response
     * @param {*} $exception
     * @returns {any}
     */
    unauthenticated($request: any, $response: any, $exception: any) {
        return $request.expectsJson() ?
            $response.json({ 'message': $exception.message }, 401) :
            $response.redirect().to($exception.redirectTo() || route('login'));
    }

    /**
     * redirect method.
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    redirect(response: any, $e: any) {
        response.with(...$e.getFlash()).withErrors(...$e.getErrors()).withInput($e.wantedInput()).redirect($e.getUrl());
    }

    /**
     * jsonException method.
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    jsonException(response: any, $e: any) {

    }

    /**
     * send method.
     * @param {*} request
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    send(request: any, response: any, $e: Record<string, any> = {}) {
        this.report($e)
        response.send($e)
    }

    /**
     * convertValidationExceptionToResponse method.
     * @param {*} request
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    convertValidationExceptionToResponse(request: any, response: any, $e: any) {
        if ($e.response) {
            return $e.response;
        }

        return request.expectsJson() ?
            this.invalidJson(request, response, $e) :
            this.invalid(request, response, $e);
    }

    /**
     * invalidJson method.
     * @param {*} request
     * @param {*} response
     * @param {*} $exception
     * @returns {any}
     */
    invalidJson(request: any, response: any, $exception: any) {
        return response.json({
            'message': $exception.getMessage(),
            'errors': $exception.getErrors(),
        }, $exception.status);
    }

    /**
     * invalid method.
     * @param {*} request
     * @param {*} response
     * @param {*} $exception
     * @returns {any}
     */
    invalid(request: any, response: any, $exception: any) {

        if (request.session instanceof Session) {
            response.withInput(Object.except(request.input(), this.$dontFlash))
                .withErrors($exception.all())
        }
        response.redirect($exception.redirectTo || 'back')
    }

    /**
     * tokenMismatchException method.
     * @param {*} request
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    tokenMismatchException(request: any, response: any, $e: any) {
        if (request.wantJson() || request.ajax()) {
            response.send({
                name: $e.name || 'Token mismatch exception',
                errors: $e.errors || {},
                message: $e.message || 'Page Expired'
            }, ($e.statusCode || 403))
        } else {
            return fs.readFile(path.join(__dirname, 'template/errors/403'), {
                encoding: 'utf8'
            }, function (error, data) {
                response.send(data, $e.statusCode)
            })
        }
    }
    /**
     * pageNotFoundException method.
     * @param {*} request
     * @param {*} response
     * @param {*} $e
     * @returns {any}
     */
    pageNotFoundException(request: any, response: any, $e: any) {
        return fs.readFile(path.join(__dirname, 'template/errors/404'), {
            encoding: 'utf8'
        }, function (error, data) {
            response.send(data, $e.statusCode)
        })
    }
    /**
     * report method.
     * @param {*} $e
     * @returns {any}
     */
    report($e: any) {
        if (!this.$dontReport.find((clazz) => $e instanceof clazz)) {
            if (typeof this[kLogger].getConfig == 'function' && !this[kLogger].getConfig('ignore_exceptions')) {
                if ($e && typeof $e == 'object') {
                    if (typeof $e.stack == 'string') {
                        $e.capture = $e.stack.split('\n    at ')
                    }
                }
                this[kLogger].error($e)
            }
        }
    }
    /**
     * renderForConsole method.
     * @param {*} $e
     * @returns {any}
     */
    renderForConsole($e: any) {
        this[kLogger].channel('console').error($e)
    }
}
module.exports = Handler
