const {
    FORBIDDEN,
    REQUIRED,
    EMPTY,
    EMAIL,
    BASE,
    ISO_DATE,
    NULL_ERROR,
    MIN,
    MIN_LENGTH,
    MAX,
    MAX_LENGTH,
    BETWEEN,
    GUID,
    ONLY,
    VALID,
    XOR,
    EMPTY_XOR,
    ALTERNATIVES,
    POSITIVE,
    INTEGER,
    GREATER_THAN,
    LETTERS_AND_CHARACTERS,
    SPECIAL_CHARACTERS,
    INVALID_DATE,
    DEPENDENCY_ERROR,
    URI_ERROR,
    ALPHANUM_ERROR,
    CUSTOM,
} = require('../../domain/enum/EnumValidator');

class ValidatorEntity {

    constructor() {
        this.appError = {
            code: '',
            details: []
        };
    }

    required(property) {

        if (!this.appError.message) {
            this.appError.code = REQUIRED;
            this.appError.message = `${property} field is required`;
        }

        this.appError.details.push({
            property,
            constraint: 'required'
        });

    }

    unknown(property, message = '') {
        if (!this.appError.message && Array.isArray(property)) {
            this.appError.code = FORBIDDEN;
            this.appError.message = message;

            property.forEach(propertyItem => {
                this.appError.details.push({
                    property: propertyItem,
                    constraint: 'forbidden'
                });
            });

            return;
        }

        if (!this.appError.message) {
            this.appError.code = FORBIDDEN;
            this.appError.message = `${property} field is forbidden`;
            this.appError.details.push({ property, constraint: 'forbidden' });
        }

    }

    trim(property) {
        if (!this.appError.message) {
            this.appError.code = EMPTY;
            this.appError.message = `${property} field can't be empty`;
        }
        this.appError.details.push({
            property,
            constraint: 'can\'t be empty'
        });
    }

    email(property) {
        if (!this.appError.message) {
            this.appError.code = EMAIL;
            this.appError.message = `${property} field must be a valid email`;
        }
        this.appError.details.push({
            property,
            constraint: 'valid email'
        });
    }

    base({ property, type }) {
        const propertyType = type.split('.')[0];

        if (!this.appError.message) {
            this.appError.code = BASE;
            this.appError.message = `${property} field must be a ${propertyType}`;
        }
        this.appError.details.push({
            property,
            constraint: `must be a valid ${propertyType}`
        });
    }

    isoDate(property) {
        if (!this.appError.message) {
            this.appError.code = ISO_DATE;
            this.appError.message = `Field ${property} must be in the format yyyy-mm-dd`;
        }

        this.appError.details.push({
            property: property,
            constraint: 'isoDate'
        });
    }

    invalidDate(property) {
        if (!this.appError.message) {
            this.appError.code = INVALID_DATE;
            this.appError.message = `Field ${property} has invalid date.`;
        }

        this.appError.details.push({
            property: property,
            constraint: 'invalidDate'
        });
    }

    guid(property) {
        if (!this.appError.message) {
            this.appError.code = GUID;
            this.appError.message = `${property} must be a valid guid`;
        }

        this.appError.details.push({
            property: property,
            constraint: 'guid'
        });
    }

    only({ property, valids }) {
        if (!this.appError.message) {
            this.appError.code = ONLY;
            this.appError.message = `${property} must be one of [${valids}]`;
        }

        this.appError.details.push({
            property: property,
            valids,
            constraint: 'must be one of'
        });
    }

    valid({ property, valids }) {
        if (!this.appError.message) {
            this.appError.code = VALID;
            this.appError.message = `${property} must be one of [${valids}]`;
        }

        this.appError.details.push({
            property: property,
            valids,
            constraint: 'must be one of'
        });
    }

    nullError(property) {
        if (!this.appError.message) {
            this.appError.code = NULL_ERROR;
            this.appError.message = `${property} field can't be null`;
        }

        this.appError.details.push({
            property,
            constraint: 'not null'
        });
    }

    min({ property, describerProperty }) {

        const messageMin = ({ property, constraint }) => {
            if (describerProperty.type === 'array') {
                return `Minimum length for field ${property} is ${constraint.limit}`;
            }
            return `Minimum value for field ${property} is ${constraint.limit}`;
        };

        const { args } = this.getRuleByKey(describerProperty, 'min');

        const errorDetails = {
            property,
            constraint: args
        };

        if (!this.appError.message) {
            this.appError.code = describerProperty.type === 'array' ? MIN_LENGTH : MIN;
            this.appError.message = messageMin(errorDetails);
        }

        this.appError.details.push(errorDetails);
    }

    max({ property, describerProperty }) {
        const messageMax = ({ property, constraint }) => {
            if (describerProperty.type === 'array') {
                return `Maximum length for field ${property} is ${constraint.limit}`;
            }

            return `Maximum value for field ${property} is ${constraint.limit}`;
        };

        const { args } = this.getRuleByKey(describerProperty, 'max');

        const errorDetails = {
            property,
            constraint: args
        };

        if (!this.appError.message) {
            this.appError.code = describerProperty.type === 'array' ? MAX_LENGTH : MAX;
            this.appError.message = messageMax(errorDetails);
        }

        this.appError.details.push(errorDetails);

    }

    between({ property, describerProperty }) {

        const minRule = this.getRuleByKey(describerProperty, 'min');
        const maxRule = this.getRuleByKey(describerProperty, 'max');

        const errorDetails = {
            property,
            minConstraint: minRule.args.limit,
            maxConstraint: maxRule.args.limit
        };

        const messageBetween = ({ property, minConstraint, maxConstraint }) =>
            `Size for field ${property} must be between ${minConstraint} and ${maxConstraint}`;

        if (!this.appError.message) {
            this.appError.code = BETWEEN;
            this.appError.message = messageBetween(errorDetails);
        }

        this.appError.details.push(errorDetails);
    }

    xor({ property, peers }) {
        if (!this.appError.message) {
            this.appError.code = XOR;
            this.appError.message = `${property} must contain only of [${peers}]`;
        }

        this.appError.details.push({
            property: property,
            constraint: peers
        });

    }

    missing({ property, peers }) {
        if (!this.appError.message) {
            this.appError.code = EMPTY_XOR;
            this.appError.message = `${property} must contain something of [${peers}]`;
        }

        this.appError.details.push({
            property: property,
            constraint: peers
        });

    }

    alternatives({ property, details }) {
        if (!this.appError.message) {
            this.appError.code = ALTERNATIVES;
            this.appError.message = `${property} must be one of ${details.map(details => details.message)}`;
        }

        this.appError.details.push({
            property: property,
            constraint: details
        });

    }

    getRuleByKey({ rules }, key) {
        return rules.find(rule => rule.name === key);
    }

    positive({ property }) {
        if (!this.appError.message) {
            this.appError.code = POSITIVE;
            this.appError.message = `${property} field must be a positive number`;
        }

        this.appError.details.push({
            property,
            constraint: 'must be a positive number'
        });
    }

    integer({ property }) {
        property = property.replace(/ *\[[^\]]*]/, '');

        if (!this.appError.message) {
            this.appError.code = INTEGER;
            this.appError.message = `${property} field must be a integer number`;
        }

        this.appError.details.push({
            property,
            constraint: 'must be a integer number'
        });
    }

    greaterThan({ property }) {
        if (!this.appError.message) {
            this.appError.code = GREATER_THAN;
            this.appError.message = `Field ${property} must be greater than the current date`;
        }

        this.appError.details.push({
            property: property,
            constraint: 'greaterThan'
        });
    }

    lettersAndCharacters({ property }) {
        if (!this.appError.message) {
            this.appError.code = LETTERS_AND_CHARACTERS;
            this.appError.message = `Field ${property} must contain only letters and characters`;
        }

        this.appError.details.push({
            property: property,
            constraint: 'must contain only letters and characters'
        });
    }

    specialCharacters({ property }) {
        if (!this.appError.message) {
            this.appError.code = SPECIAL_CHARACTERS;
            this.appError.message = `Field ${property} must be alphabet character`;
        }

        this.appError.details.push({
            property: property,
            constraint: 'must be alphabet character'
        });
    }

    and({ property, present, missing: peers }) {
        if (!this.appError.message) {
            this.appError.code = DEPENDENCY_ERROR;
            this.appError.message = `${property} contains [${present}] without its required peers [${peers}]`;
        }

        this.appError.details.push({
            property: property,
            constraint: peers
        });
    }

    uri(property) {
        if (!this.appError.message) {
            this.appError.code = URI_ERROR;
            this.appError.message = `${property} field must be a valid URI`;
        }

        this.appError.details.push({
            property,
            constraint: 'valid uri'
        });
    }

    alphanum(property) {
        if (!this.appError.message) {
            this.appError.code = ALPHANUM_ERROR;
            this.appError.message = `${property} field must be a valid alphanumeric string`;
        }

        this.appError.details.push({
            property,
            constraint: 'valid alphanum'
        });
    }

    custom(property, constraint = 'valid custom') {
        if (!this.appError.message) {
            this.appError.code = CUSTOM;
            this.appError.message = `${property} field invalid.`;
        }

        this.appError.details.push({
            property,
            constraint
        });
    }

}

module.exports = ValidatorEntity;
