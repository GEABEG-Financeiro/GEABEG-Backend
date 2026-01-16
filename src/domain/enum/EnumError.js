const Enum = require('../enum/Enum');

const applicationError = Enum({
    BUSINESS: 'business',
    CONTRACT: 'contract',
    UNAUTHORIZED: 'unauthorized',
    FORBIDDEN: 'forbidden',
    NOT_FOUND: 'notFound',
    OPERATION: 'operation',
    BAD_REQUEST: 'Bad Request',
    GATEWAY_TIMEOUT: 'gatewayTimeout',
    INTEGRATION: 'integration',
    CONFLICT: 'conflict'
});

// map error_code to http_error
const applicationErrorCode = Enum({
    '116': 'business',
    '400': 'contract',
    '401': 'unauthorized',
    '403': 'forbidden',
    '404': 'notFound',    
    '422': 'business',
    '500': 'operation',
    '504': 'integration'    
});

module.exports = { applicationError, applicationErrorCode };