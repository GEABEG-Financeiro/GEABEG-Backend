const joi = require('@hapi/joi');
const EnumPaymentStatus = require('../../../domain/enum/EnumPaymentStatus');
const EnumProductType = require('../../../domain/enum/EnumProductType');


const getProductParamsSchema = {
    params: joi.object().keys({
        name: joi.string().trim().options({ convert: true }),
        type: joi.string().trim().options({ convert: true }).valid(...EnumProductType.values())
    }),
};

const getProductByIdParamsSchema = {
    params: joi.object().keys({
        product_id: joi.string().guid({ version: ['uuidv4'] }).required()
    }),
};

const updateProductsHeaderSchema = {
    headers: joi.object().keys({
        product_id: joi.string().guid({ version: ['uuidv4'] }).required()
    })
};

const updateStudentPaymentList = {
    body: joi.object().keys({
        payers_list: joi
            .array()
            .items(
                joi.object().keys({
                    student_id: joi.string().guid({ version: ['uuidv4'] }).required(),
                    name: joi.string().trim().options({ convert: true }).required().example('gabriel'),
                    status: joi.string().trim().options({ convert: true }).valid(...EnumPaymentStatus.values()).example(EnumPaymentStatus.PENDING)
                })
            )
            .required()
    })
};

const updateProductBodySchema = {
    body: joi.object().keys({
        name: joi.string().trim().options({ convert: true }).required().example('gabriel'),
        price: joi.number().integer().options({ convert: true }).example(100),
        type: joi.string().trim().options({ convert: true }).valid(...EnumProductType.values()).example(EnumProductType.PRODUCT),
        description: joi.string().trim().options({ convert: true }).example('Any hair routine'),
        start_date: joi.string().max(5).example('2026-01-11').trim().options({ convert: true }),
        end_date: joi.string().max(5).example('2026-02-15').trim().options({ convert: true })
    })
};

const deleteProductHeadersSchema = {
    headers: joi.object().keys({
        product_id: joi.string().guid({ version: ['uuidv4'] }).required()
    })
};

const createProductBodySchema = {
    body: joi.object().keys({
        name: joi.string().trim().options({ convert: true }).required().example('Parcela novembro'),
        price: joi.number().integer().options({ convert: true }).example(100),
        description: joi.string().trim().options({ convert: true }).example('parcela de novembro da escola'),
        start_date: joi.string().trim().options({ convert: true }).example('2026-08-15').required(),
        end_date: joi.string().trim().options({ convert: true }).example('2026-08-17').required(),
        type: joi.string().trim().options({ convert: true }).valid(...EnumProductType.values()).example(EnumProductType.PRODUCT),
        giver_name: joi.string().trim().options({ convert: true }).example('Joazinho'),
    })
};

module.exports = () => ({
    getProductParamsSchema,
    updateProductsHeaderSchema,
    updateProductBodySchema,
    deleteProductHeadersSchema,
    getProductByIdParamsSchema,
    createProductBodySchema,
    updateStudentPaymentList,
    bodyOptions: { abortEarly: false, convert: false, allowUnknown: true, stripUnknown: true }
});

