const { applicationError } = require('../enum/EnumError');

class ErrorService {

    [applicationError.BUSINESS]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '422';

        const error = this._buildError(message);

        error.error_type = applicationError.BUSINESS;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.UNAUTHORIZED]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '401';

        const error = this._buildError(message);

        error.error_type = applicationError.UNAUTHORIZED;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.CONTRACT]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '400';

        const error = this._buildError(message);

        error.error_type = applicationError.CONTRACT;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.NOT_FOUND]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '404';

        const error = this._buildError(message);

        error.error_type = applicationError.NOT_FOUND;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.INTEGRATION]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '503';

        const error = this._buildError(message);

        error.error_type = applicationError.INTEGRATION;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.OPERATION]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '500';

        const error = this._buildError(message);

        error.error_type = applicationError.OPERATION;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.FORBIDDEN]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '403';

        const error = this._buildError(message);

        error.error_type = applicationError.FORBIDDEN;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.GATEWAY_TIMEOUT]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '504';

        const error = this._buildError(message);

        error.error_type = applicationError.GATEWAY_TIMEOUT;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    [applicationError.CONFLICT]({ message, code, details = [] }, error_code) {
        const defaultErrorCode = '409';

        const error = this._buildError(message);

        error.error_type = applicationError.CONFLICT;
        error.error_code = error.error_code || error_code || defaultErrorCode;
        error.code = code;
        error.details = details;

        return error;
    }

    _buildError(error) {
        if (typeof error === 'string')
            error = new Error(error);
        if (error instanceof Error)
            return error;

        return new Error('Unknown error');
    }

}

module.exports = ErrorService;
