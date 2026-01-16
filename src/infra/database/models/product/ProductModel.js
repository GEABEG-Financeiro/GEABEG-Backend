const EnumPaymentStatus = require('../../../../domain/enum/EnumPaymentStatus');
const EnumProductType = require('../../../../domain/enum/EnumProductType');

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(EnumProductType.values()),
            allowNull: false
        },
        giver_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payers_list: {
            type: DataTypes.ARRAY(
                DataTypes.JSONB({
                    student_id: {
                        type: DataTypes.UUID,
                    },
                    name: {
                        type: DataTypes.STRING,
                    },
                    status: {
                        type: DataTypes.ENUM(EnumPaymentStatus.values())
                    },
                }))
        }
    }, { timestamps: true })
    return Product;
};