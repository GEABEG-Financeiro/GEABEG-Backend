const moment = require('moment');

module.exports = (input, helpers) => {
    const isValidDate = moment(helpers.original, 'YYYY-MM-DD', true).isValid();

    if (!isValidDate) {
        return helpers.error('string.isoDate');
    }

    return input;
};