const EnumRamosType = require('../../../../domain/enum/EnumRamosType');
const EnumPaymentStatus = require('../../../../domain/enum/EnumPaymentStatus');

module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("student", {
        student_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bith_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ramo: {
            type: DataTypes.ENUM(EnumRamosType.values()),
            allowNull: false
        },
        parents: {
            type: DataTypes.ARRAY(
                DataTypes.JSONB({
                    parent_name: {
                        type: DataTypes.STRING,
                        allowNull: false
                    },
                    contact: {
                        type: DataTypes.STRING,
                        allowNull: false
                    }
                }))
        },
        age: {
            type: DataTypes.STRING
        },
        rg: {
            type: DataTypes.STRING
        },
        phone_number: {
            type: DataTypes.STRING
        },
        adress: {
            type: DataTypes.STRING
        },
        cep: {
            type: DataTypes.STRING
        },
        uf: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        complement: {
            type: DataTypes.STRING
        },
        reference: {
            type: DataTypes.STRING
        },
        product_list: {
            type: DataTypes.ARRAY(
                DataTypes.JSONB({
                    product_id: {
                        type: DataTypes.STRING,
                        allowNull: false
                    },
                    name: {
                        type: DataTypes.STRING,
                        allowNull: false
                    },
                    price: {
                        type: DataTypes.INTEGER,
                        allowNull: false
                    },
                    status: {
                        type: DataTypes.STRING,
                        allowNull: false
                    }
                })),
            allowNull: true,
            defaultValue: []
        }
    }, { timestamps: true },)
    return Student;
};