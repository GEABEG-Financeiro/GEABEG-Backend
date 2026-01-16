const { applicationErrorCode } = require('../../domain/enum/EnumError');

module.exports = ({ httpError }) => ({ error_code = '', error_type }) => {

    error_code = error_code.split('-')[1];
    const method = applicationErrorCode[error_code] || error_type || 'internalError';

    return httpError[method];
};
