const joi = require('@hapi/joi');
const DateValidator = require('../../../infra/suppport/DateValidator');
const EnumRamosType = require('../../../domain/enum/EnumRamosType');
const EnumPaymentStatus = require('../../../domain/enum/EnumPaymentStatus');
const CPF_REGEX = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
const RG_REGEX = /^(\d{1,2}\.?\d{3}\.?\d{3}-?\d{1}|\d{7,9})$/;

const createStudentBodySchema = {
    body: joi.object().keys({
        name: joi.string().trim().options({ convert: true }).min(2).max(80).example('Chico Silva').required(),
        cpf: joi.string().trim().options({ convert: true }).example('068.958.764-60').regex(CPF_REGEX).required(),
        bith_date: joi.string().trim().options({ convert: true }).example('2001-08-15').required(),
        age: joi.number().integer().options({ convert: true }).min(1).max(120).example(10).required(),
        rg: joi.string().trim().options({ convert: true }).example('12.345.678-9').regex(RG_REGEX).min(7).max(12).required(),
        phone_number: joi.string().trim().options({ convert: true }).example('88997767444').min(10).max(11).required(),
        adress: joi.string().trim().options({ convert: true }).example('Rua das Dores, 123').min(5).max(120).required(),
        ramo: joi.string().trim().options({ convert: true }).valid(...EnumRamosType.values()).example('lobinho').min(3).max(30).required(),
        parents: joi.array().items(
            joi.object().keys({
                parent_name: joi.string().example('José da Silva').trim().options({ convert: true }).min(2).max(80),
                contact: joi.string().trim().options({ convert: true }).example('88997767444').min(10).max(11)
            })
        ),
        date: joi.string().custom(DateValidator).example('2025-06-21'),
        cep: joi.string().trim().options({ convert: true }).example('60123-456').min(8).max(9).required(),
        uf: joi.string().trim().options({ convert: true }).example('CE').length(2).required(),
        city: joi.string().trim().options({ convert: true }).example('Fortaleza').min(2).max(60).required(),
        complement: joi.string().trim().options({ convert: true }).example('Apto 45').max(100).allow('').required(),
        reference: joi.string().trim().options({ convert: true }).example('Próximo ao mercado central').min(2).max(150).required()
    })
};

const updateStudentStatusParamsSchema = {
    params: joi.object().keys({
        student_id: joi.string().guid({ version: ['uuidv4'] }).required(),
    })
};

const getStudentByIdParamsSchema = {
    params: joi.object().keys({
        student_id: joi.string().guid({ version: ['uuidv4'] }).required(),
    }),
};

const getStudentQuerySchema = {
    query: joi.object().keys({
        name: joi.string().trim().options({ convert: true }).min(2).max(80).example('Chico Silva'),
        ramo: joi.string().trim().options({ convert: true }).valid(...EnumRamosType.values()).example('lobinho').min(3).max(30)
    })
};

const updateStudentParamsSchema = {
    params: joi.object().keys({
        student_id: joi.string().trim().options({ convert: true }).example('example@gmail.com').required()
    })
};

const updateStudentStatusHeadersSchema = {
    headers: joi.object().keys({
        product_id: joi.string().guid({ version: ['uuidv4'] }).required()
    })
};

const updateStudentStatusBodySchema = {
    body: joi.object().keys({
        status: joi.string().trim().options({ convert: true }).valid(...EnumPaymentStatus.values()).example(EnumPaymentStatus.PENDING)
    })
};

const updateStudentBodySchema = {
    body: joi.object().keys({
        name: joi.string().trim().options({ convert: true }).min(2).max(80).example('Chico Silva').required(),
        cpf: joi.string().trim().options({ convert: true }).example('068.958.764-60').regex(CPF_REGEX).required(),
        bith_date: joi.string().trim().options({ convert: true }).example('2001-08-15').required(),
        age: joi.number().integer().options({ convert: true }).min(1).max(120).example(10).required(),
        rg: joi.string().trim().options({ convert: true }).example('12.345.678-9').regex(RG_REGEX).min(7).max(12).required(),
        phone_number: joi.string().trim().options({ convert: true }).example('88997767444').min(10).max(11).required(),
        adress: joi.string().trim().options({ convert: true }).example('Rua das Dores, 123').min(5).max(120).required(),
        ramo: joi.string().trim().options({ convert: true }).valid(...EnumRamosType.values()).example('lobinho').min(3).max(30).required(),
        parents: joi.array().items(
            joi.object().keys({
                parent_name: joi.string().example('José da Silva').trim().options({ convert: true }).min(2).max(80),
                contact: joi.string().trim().options({ convert: true }).example('88997767444').min(10).max(11).required()
            })
        ),
        cep: joi.string().trim().options({ convert: true }).example('60123-456').min(8).max(9).required(),
        uf: joi.string().trim().options({ convert: true }).example('CE').length(2).required(),
        city: joi.string().trim().options({ convert: true }).example('Fortaleza').min(2).max(60).required(),
        complement: joi.string().trim().options({ convert: true }).example('Apto 45').max(100).allow('').required(),
        reference: joi.string().trim().options({ convert: true }).example('Próximo ao mercado central').min(2).max(150).required()
    })
};

const deleteStudentParamsSchema = {
    params: joi.object().keys({
        student_id: joi.string().trim().options({ convert: true }).example('example@gmail.com').required()
    })
};

module.exports = () => ({
    getStudentByIdParamsSchema,
    getStudentQuerySchema,
    updateStudentBodySchema,
    deleteStudentParamsSchema,
    createStudentBodySchema,
    updateStudentParamsSchema,
    updateStudentStatusParamsSchema,
    updateStudentStatusHeadersSchema,
    updateStudentStatusBodySchema,
    bodyOptions: { abortEarly: false, convert: false, allowUnknown: true, stripUnknown: true }
});

