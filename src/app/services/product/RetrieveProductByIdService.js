const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ productRepository, exception }) => ({
    execute: async (product_id) => {
        try {
            const productRetrieved = await productRepository.findOneProduct({
                where: {
                    product_id: product_id
                }
            });

            if (productRetrieved) {
                if (productRetrieved?.image) {
                    let imgBase64 = Buffer.from(productRetrieved?.image).toString('base64');
                    productRetrieved.image = `data:image/png;base64,${imgBase64}`;
                }
                return productRetrieved;
            } else {
                throw exception.notFound(errorFactory([
                    `Any product not found with the product_id ${product_id}`,
                    `Any product not found with the product_id ${product_id}`
                ]));
            }
        } catch (error) {
            console.log('getProductById - product_id:', product_id, ' - [Error]: ', error);
            throw error;
        }
    }
});