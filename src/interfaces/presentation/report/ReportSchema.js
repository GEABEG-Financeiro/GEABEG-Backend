const joi = require('@hapi/joi');

const generateReportBodySchema = {
    body: joi.object().keys({
        start_date: joi.string().trim().options({ convert: true }).example('2026-08-15').required(),
        end_date: joi.string().trim().options({ convert: true }).example('2026-08-17'),
    })
};

module.exports = () => ({
    generateReportBodySchema,
    bodyOptions: { abortEarly: false, convert: false, allowUnknown: true, stripUnknown: true }
});

