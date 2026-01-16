const joi = require('@hapi/joi');



const generateReportBodySchema = {
    body: joi.object().keys({
        start_date: joi.string().max(5).example('2026-01-11').trim().options({ convert: true }),
        end_date: joi.string().max(5).example('2026-02-15').trim().options({ convert: true })
    })
};


module.exports = () => ({
    generateReportBodySchema,
    bodyOptions: { abortEarly: false, convert: false, allowUnknown: true, stripUnknown: true }
});

