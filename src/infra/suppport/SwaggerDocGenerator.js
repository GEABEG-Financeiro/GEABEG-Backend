const swaggerJsdoc = require('swagger-jsdoc');
const { parseJoiSchema } = require('./JoiToSwagger');

const defaultOptions = {
    title: 'API swagger',
    version: 'v1',
    description: 'Auto generated api swagger',
    basePath: '/api',
    schemes: ['http']
};

const parseValidation = {
    body: (item) => {
        return [{
            in: item.type,
            required: true,
            name: item.type,
            schema: parseJoiSchema(item.parameter).swagger
        }];
    },

    formData: (item) => {
        const { properties, required } = parseJoiSchema(item.parameter).swagger;
        return Object.keys(properties).map(propertyKey => {
            return {
                name: propertyKey,
                in: 'formData',
                required: required && required.includes(propertyKey),
                type: (propertyKey === 'file') ? 'file' : properties[propertyKey].type,
                description: properties[propertyKey].description
            };
        });
    },

    query: (item) => {
        const { properties, required } = parseJoiSchema(item.parameter).swagger;
        return Object.keys(properties).map(propertyKey => {
            return {
                name: propertyKey,
                in: item.type,
                required: required && required.includes(propertyKey),
                type: properties[propertyKey].type,
                description: properties[propertyKey].description,
                items: properties[propertyKey].items || {}
            };
        });
    },
    params: (item) => {
        const { properties, required } = parseJoiSchema(item.parameter).swagger;
        return Object.keys(properties).map(propertyKey => {
            return {
                name: propertyKey,
                in: 'path',
                required: required && required.includes(propertyKey),
                type: properties[propertyKey].type,
                description: properties[propertyKey].description
            };
        });
    },
    headers: (item) => {
        const { properties, required } = parseJoiSchema(item.parameter).swagger;
        return Object.keys(properties).map(propertyKey => {
            return {
                name: propertyKey,
                in: 'header',
                required: required && required.includes(propertyKey),
                type: properties[propertyKey].type
            };
        });
    }
};

const parseParameters = arrParameters => {
    let parameters = [];

    arrParameters.forEach(item => {
        parameters = parameters.concat(parseValidation[item.type](item));
    });

    return parameters;
};

const generateSwagger = (routes, options = defaultOptions) => {
    try {
        const {
            title = defaultOptions.title,
            version = defaultOptions.version,
            description = defaultOptions.description,
            basePath = defaultOptions.basePath,
            schemes = defaultOptions.schemes
        } = options;
        const paths = {};

        routes.forEach(route => {
            let { method, path, description = '', validation, tags = [], consumes, produces, responses  } = route;
            const { body, headers, formData, params, query } = validation;
            const arrParameters = [
                { type: 'body', parameter: body },
                { type: 'headers', parameter: headers },
                { type: 'params', parameter: params },
                { type: 'formData', parameter: formData },
                { type: 'query', parameter: query }
            ].filter(item => item.parameter !== undefined);

            if (path.includes(':')) {
                const params = path.match(/:[-a-zA-Z0-9@:%._+~#=]+/g);
                params.forEach(param => {
                    path = path.replace(param, `{${param.replace(':', '')}}`);
                });
            }

            if (!Array.isArray(tags)) {
                tags = [];
            }

            if (responses) {
                Object.keys(responses).map(function(key) {

                    let value = responses[key];
                    if (value.schema) {
                        value.schema = parseJoiSchema(value.schema).swagger;
                    }
                });
            }

            paths[path] = paths[path] || {};
            paths[path][method] = {
                consumes: consumes || ['application/json'],
                produces: produces || ['application/json'],
                description,
                tags,
                parameters: parseParameters(arrParameters),
                responses: responses || {}
            };
        });

        const swaggerDoc = {
            swaggerDefinition: {
                info: {
                    title, version, description
                },
                basePath,
                schemes,
                paths
            },
            apis: []
        };

        return swaggerJsdoc(swaggerDoc);
    } catch (error) {
        console.warn(error);
        const { title, version, description, basePath, schemes } = defaultOptions;
        return swaggerJsdoc({
            swaggerDefinition: {
                info: {
                    title, version, description
                },
                basePath,
                schemes
            },
            apis: []
        });
    }
};

module.exports = { generateSwagger };
