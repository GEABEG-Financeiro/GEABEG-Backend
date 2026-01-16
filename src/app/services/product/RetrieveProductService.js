const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ productRepository, exception }) => ({
    execute: async (query) => {
        console.log('getProduct - query: ', query);

        try {
            let filter = {};

            if (query) {

                let queryBuilder = [];

                if (query.name) {
                    queryBuilder.push({
                        name: {
                            [Op.iLike]: `%${query.name}%`
                        }
                    });
                }
                if (query.type) {
                    queryBuilder.push({
                        type: query.type
                    });
                }

                filter = {
                    where: {
                        [Op.and]: queryBuilder
                    }
                };

            }

            const productsRetrieved = await productRepository.findAllProduct(filter);

            if (productsRetrieved) {
                return productsRetrieved;
            } else {
                throw exception.notFound(errorFactory([
                    `product not found with this name or type ${query}`,
                    `product not found with this name or type ${query}`
                ]));
            }
        }
        catch (error) {
            console.log('getProduct - queryType:', query, ' - [Error]: ', error);
            throw error;
        }
    }
});
