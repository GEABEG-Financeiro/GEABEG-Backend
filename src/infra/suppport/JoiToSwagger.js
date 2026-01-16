const find = (items, query) => {
    if (!items || !items.length)
        return false;
    return items.find(item => Object.keys(query).every(key => item[key] === query[key]));
};
const meta = (schema, key) => {
    const meta = schema.metas && schema.metas.find(meta => meta[key] !== undefined);
    return meta && meta[key];
};
const merge = Object.assign;

const patterns = {
    alphanum: '^[a-zA-Z0-9]*$',
    alphanumLower: '^[a-z0-9]*$',
    alphanumUpper: '^[A-Z0-9]*$',
};

const getMinMax = (schema, suffix = 'Length') => {
    const swagger = {};

    if (!schema.rules)
        return swagger;

    for (let i = 0; i < schema.rules.length; i++) {
        const test = schema.rules[i];
        if (test.name === 'min') {
            swagger[`min${suffix}`] = test.args.limit;
        }

        if (test.name === 'max') {
            swagger[`max${suffix}`] = test.args.limit;
        }

        if (test.name === 'length') {
            swagger[`min${suffix}`] = test.args.limit;
            swagger[`max${suffix}`] = test.args.limit;
        }
    }
    return swagger;
};

const getCaseSuffix = (schema) => {
    const caseRule = find(schema.rules, { name: 'case' });
    if (caseRule && caseRule.args.direction === 'lower') {
        return 'Lower';
    } else if (caseRule && caseRule.args.direction === 'upper') {
        return 'Upper';
    }
    return '';
};

const parseAsType = {
    number: (schema) => {
        const swagger = {};

        if (find(schema.rules, { name: 'integer' })) {
            swagger.type = 'integer';
        } else {
            swagger.type = 'number';
            if (find(schema.rules, { name: 'precision' })) {
                swagger.format = 'double';
            } else {
                swagger.format = 'float';
            }
        }

        const sign = find(schema.rules, { name: 'sign' });
        if (sign) {
            if (sign.args.sign === 'positive') {
                swagger.minimum = 1;
            } else if (sign.args.sign === 'negative') {
                swagger.maximum = -1;
            }
        }

        const min = find(schema.rules, { name: 'min' });
        if (min) {
            swagger.minimum = min.args.limit;
        }

        const max = find(schema.rules, { name: 'max' });
        if (max) {
            swagger.maximum = max.args.limit;
        }

        if (schema.allow) {
            const valids = schema.allow.filter((s) => typeof s === 'number');
            if (schema.flags && schema.flags.only && valids.length) {
                swagger.enum = valids;
            }
        }

        return swagger;
    },
    string: (schema) => {
        const swagger = { type: 'string' };

        if (find(schema.rules, { name: 'alphanum' })) {
            const strict = (schema.preferences && schema.preferences.convert) === false;
            swagger.pattern = patterns[`alphanum${strict ? getCaseSuffix(schema) : ''}`];
        }

        if (find(schema.rules, { name: 'token' })) {
            swagger.pattern = patterns[`alphanum${getCaseSuffix(schema)}`];
        }

        if (find(schema.rules, { name: 'email' })) {
            swagger.format = 'email';
            if (swagger.pattern) delete swagger.pattern;
        }

        if (find(schema.rules, { name: 'isoDate' })) {
            swagger.format = 'date-time';
            if (swagger.pattern) delete swagger.pattern;
        }

        if (find(schema.rules, { name: 'guid' })) {
            swagger.format = 'uuid';
            if (swagger.pattern) delete swagger.pattern;
        }

        const pattern = find(schema.rules, { name: 'pattern' });
        if (pattern) {
            swagger.pattern = pattern.args.regex.toString().slice(1, -1);
        }

        Object.assign(swagger, getMinMax(schema));

        if (schema.allow) {
            const valids = schema.allow.filter((s) => typeof s === 'string');
            if (schema.flags && schema.flags.only && valids.length) {
                swagger.enum = valids;
            }
        }

        return swagger;
    },
    binary: (schema) => {
        const swagger = { type: 'string', format: 'binary' };

        if ((schema.flags && schema.flags.encoding) === 'base64') {
            swagger.format = 'byte';
        }

        Object.assign(swagger, getMinMax(schema));

        return swagger;
    },
    date: () => ({ type: 'string', format: 'date-time' }),
    boolean: () => ({ type: 'boolean' }),
    alternatives: (schema, existingComponents, newComponentsByRef) => {
        const index = meta(schema, 'swaggerIndex') || 0;
        const matches = schema.matches || [];
        const firstItem = matches[index];

        let itemsSchema;
        if (firstItem.ref) {
            if (schema._baseType && !firstItem.otherwise) {
                itemsSchema = index ? firstItem.then : schema.baseType;
            } else {
                if (firstItem.switch) {
                    itemsSchema = { type: 'any' };
                } else {
                    itemsSchema = index ? firstItem.otherwise : firstItem.then;
                }
            }
        } else if (index) {
            itemsSchema = matches[index].schema;
        } else {
            itemsSchema = firstItem.schema;
        }

        const items = parseDescription(itemsSchema, merge({}, existingComponents || {}, newComponentsByRef || {}));
        if ((itemsSchema.flags && itemsSchema.flags.presence) === 'required') {
            items.swagger.__required = true;
        }

        merge(newComponentsByRef, items.components || {});

        return items.swagger;
    },
    array: (schema, existingComponents, newComponentsByRef) => {
        const index = meta(schema, 'swaggerIndex') || 0;
        const itemsSchema = (schema.items && schema.items[index]) || { type: 'any' };

        if (!itemsSchema) throw Error('Array schema does not define an items schema at index ' + index);

        const items = parseDescription(itemsSchema, merge({}, existingComponents || {}, newComponentsByRef || {}));

        merge(newComponentsByRef, items.components || {});

        const swagger = { type: 'array' };

        Object.assign(swagger, getMinMax(schema, 'Items'));

        if (find(schema.rules, { name: 'unique' })) {
            swagger.uniqueItems = true;
        }

        swagger.items = items.swagger;
        return swagger;
    },
    object: (schema, existingComponents, newComponentsByRef) => {
        const requireds = [];
        const properties = {};
        const combinedComponents = merge({}, existingComponents || {}, newComponentsByRef || {});
        const children = schema.keys || {};

        Object.keys(children).forEach(key => {
            const child = children[key];
            const prop = parseDescription(child, combinedComponents);
            if (!prop.swagger) { // swagger is falsy if joi.forbidden()
                return;
            }

            merge(newComponentsByRef, prop.components || {});
            merge(combinedComponents, prop.components || {});

            properties[key] = prop.swagger;

            if ((child.flags && child.flags.presence) === 'required' || prop.swagger.__required) {
                requireds.push(key);
                delete prop.swagger.__required;
            }
        });

        const swagger = { type: 'object' };
        if (requireds.length)
            swagger.required = requireds;

        swagger.properties = properties;

        if ((schema.flags && schema.flags.unknown) !== true)
            swagger.additionalProperties = false;

        return swagger;
    },
    any: (schema) => {
        const swagger = {};
        // convert property to file upload, if indicated by meta property
        if (meta(schema, 'swaggerType') === 'file') {
            swagger.type = 'file';
            swagger.in = 'formData';
        } else if (meta(schema, 'swaggerType') === 'fileResponse') {
            swagger.type = 'file';
        }
        return swagger;
    },
};

function parseDescription(schemaDescription, existingComponents) {
    if ((schemaDescription.flags && schemaDescription.flags.presence) === 'forbidden')
        return false;

    const type = schemaDescription.baseType || schemaDescription.type;

    if (!parseAsType[type])
        throw new TypeError(`${type} is not a recognized Joi type.`);

    const components = {};
    const swagger = parseAsType[type](schemaDescription, existingComponents, components);

    if (!swagger) return { swagger, components };

    if (schemaDescription.allow && schemaDescription.allow.includes(null))
        swagger['x-nullable'] = true;

    const description = schemaDescription.flags && schemaDescription.flags.description;
    if (description)
        swagger.description = description;

    if (schemaDescription.examples) {
        if (schemaDescription.examples.length === 1) {
            swagger.example = schemaDescription.examples[0];
        } else {
            swagger.examples = schemaDescription.examples;
        }
    }

    const label = schemaDescription.flags && schemaDescription.flags.label;
    if (label)
        swagger.title = label;

    const defaultValue = schemaDescription.flags && schemaDescription.flags.default;
    if (defaultValue && typeof defaultValue !== 'function') {
        swagger.default = defaultValue;
    }

    return { swagger, components };
}

function parseJoiSchema(schema) {
    let schemaDescription = {};

    if (!schema) throw new Error('No schema is specified');

    schemaDescription = schema.describe();

    return parseDescription(schemaDescription);
}

module.exports = { parseJoiSchema };
