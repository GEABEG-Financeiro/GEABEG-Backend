const BODY = 'body';
const ValidatorEntity = require('../../domain/error/ValidatorEntity');

module.exports = () => ({
    validateContract: (validation, stripUnknown = true, allowUnknown = true) => (req, res, next) => {
        try {
            const { exception } = req.container.cradle;
            const schemaOptions = { abortEarly: false, convert: false, allowUnknown, stripUnknown };

            Object.keys(validation).forEach(validationKey => {
                const schema = validation[validationKey];
                const makeValidator = (actualSchemaOptions) =>
                    (actualSchema) =>
                        actualSchema.validate(req[validationKey], actualSchemaOptions);
                let validator = makeValidator(schemaOptions);

                if (validationKey !== BODY) {
                    validator = makeValidator({ ...schemaOptions, convert: true });
                }

                const { error, value } = validator(schema);

                if (error) {
                    const schemaDescribe = schema.describe();
                    const validatorService = new ValidatorEntity();

                    error.details.map(detail => {
                        const errorData = {
                            context: detail.context,
                            type: detail.type,
                        };

                        if (detail.message) {
                            errorData.message = detail.message;
                        }

                        return errorData;
                    })
                        .map(({ type, context, message }) => {
                            const { value, valids, label: property, peers, details, present, missing } = context;

                            if (type.includes('required')) {
                                validatorService.required(property);
                                return validatorService.appError;
                            }

                            if (type.includes('unknown')) {
                                if (message) {
                                    validatorService.unknown(property, message);
                                    return validatorService.appError;
                                }
                                validatorService.unknown(property);
                                return validatorService.appError;
                            }

                            if (type.includes('trim') || type.includes('empty')) {
                                validatorService.trim(property);
                                return validatorService.appError;
                            }

                            if (type.includes('email')) {
                                validatorService.email(property);
                                return validatorService.appError;
                            }

                            if (type.includes('base') && value !== null) {
                                validatorService.base({ property, type });
                                return validatorService.appError;
                            }

                            if (type.includes('isoDate')) {
                                validatorService.isoDate(property);
                                return validatorService.appError;
                            }

                            if (type.includes('invalidDate')) {
                                validatorService.invalidDate(property);
                                return validatorService.appError;
                            }

                            if (type.includes('guid')) {
                                validatorService.guid(property);
                                return validatorService.appError;
                            }

                            if (type.includes('only')) {
                                validatorService.only({ property, valids });
                                return validatorService.appError;
                            }

                            if (type.includes('valid')) {
                                validatorService.valid({ property, valids });
                                return validatorService.appError;
                            }

                            if (value === null) {
                                validatorService.nullError(property);
                                return validatorService.appError;
                            }

                            if (type.includes('xor')) {
                                validatorService.xor({ property, peers });
                                return validatorService.appError;
                            }

                            if (type.includes('missing')) {
                                validatorService.missing({ property, peers });
                                return validatorService.appError;
                            }

                            if (type.includes('alternatives')) {
                                validatorService.alternatives({ property, details });
                                return validatorService.appError;
                            }

                            if (type.includes('positive')) {
                                validatorService.positive({ property });
                                return validatorService.appError;
                            }

                            if (type.includes('integer')) {
                                validatorService.integer({ property });
                                return validatorService.appError;
                            }

                            if (type.includes('greaterThan')) {
                                validatorService.greaterThan({ property });
                                return validatorService.appError;
                            }

                            if (type.includes('lettersAndCharacters')) {
                                validatorService.lettersAndCharacters({ property });
                                return validatorService.appError;
                            }

                            if (type.includes('specialCharacters')) {
                                validatorService.specialCharacters({ property });
                                return validatorService.appError;
                            }

                            if (type.includes('and')) {
                                validatorService.and({ property, present, missing });
                                return validatorService.appError;
                            }

                            if (type.includes('uri')) {
                                validatorService.uri(property);
                                return validatorService.appError;
                            }

                            if (type.includes('alphanum')) {
                                validatorService.alphanum(property);
                                return validatorService.appError;
                            }

                            if (type.includes('custom')) {
                                validatorService.custom(property, message);
                                return validatorService.appError;
                            }

                            let describerProperty;

                            if (property.includes('.')) {

                                if (property.match(/^\[([\d+]+)\]/g)) {
                                    const propertyName = property.split('.')[1];
                                    describerProperty = schemaDescribe.items[0].keys[propertyName];
                                } else {
                                    describerProperty = property.split('.').reduce((schemaDescribeAcc, propertyName) => {

                                        if (propertyName.match(/\[([\d+]+)\]/g)) {
                                            return schemaDescribe.keys[propertyName.split('[')[0]].items[0];
                                        }

                                        if (!schemaDescribeAcc) {
                                            return schemaDescribe.keys[propertyName];
                                        }

                                        if (propertyName) {
                                            if (schemaDescribeAcc.whens && schemaDescribeAcc.whens[0].then.keys) {
                                                return schemaDescribeAcc.whens[0].then.keys[propertyName];
                                            }
                                            return schemaDescribeAcc.keys[propertyName];
                                        }

                                        return schemaDescribeAcc;
                                    }, undefined);
                                }
                            } else {
                                describerProperty = schemaDescribe.keys[property];
                            }

                            const hasRuleForName = (describerProperty) => (name) => {
                                if (!describerProperty.rules)
                                    return false;
                                return describerProperty.rules.some(rule => rule.name.includes(name));
                            };
                            const hasMin = hasRuleForName(describerProperty)('min');
                            const hasMax = hasRuleForName(describerProperty)('max');

                            if (hasMin && hasMax) {
                                validatorService.between({ property, describerProperty });
                                return validatorService.appError;

                            }

                            if (hasMin) {
                                validatorService.min({ property, describerProperty });
                                return validatorService.appError;

                            }

                            if (hasMax) {
                                validatorService.max({ property, describerProperty });
                                return validatorService.appError;

                            }

                            return validatorService.appError;
                        });
                    throw exception.contract(validatorService.appError);
                }

                req[validationKey] = value;
            });

            return next();

        } catch (error) {
            next(error);
        }
    }
});

