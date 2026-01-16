module.exports = ({ httpConstants, exception }) => ({

    contract: ({ error_code, message, details = [], stack }) => ({
        error_code,
        message,
        details: details.map(detail => ({
            message: detail.message,
            path: detail.path
        })),
        status_code: httpConstants.BAD_REQUEST,
        stack_trace: stack
    }),

    notFound: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.NOT_FOUND,
        stack_trace: stack
    }),

    business: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.UNPROCESSABLE_ENTITY,
        stack_trace: stack
    }),

    integration: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.SERVICE_UNAVAILABLE,
        stack_trace: stack
    }),

    operation: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.code.INTERNAL_SERVER_ERROR,
        stack_trace: stack
    }),

    forbidden: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.FORBIDDEN,
        stack_trace: stack,
    }),

    gatewayTimeout: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.code.GATEWAY_TIMEOUT,
        stack_trace: stack
    }),

    conflict: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.CONFLICT,
        stack_trace: stack
    }),

    unauthorized: ({ error_code, message, stack }) => ({
        error_code,
        message,
        status_code: httpConstants.UNAUTHORIZED,
        stack_trace: stack
    }),

    internalError: ({ error_code, stack }) => ({
        error_code,
        message: 'Internal server Error',
        status_code: httpConstants.INTERNAL_SERVER_ERROR,
        stack
    }),
});
