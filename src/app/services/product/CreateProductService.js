const { v4: uuidv4 } = require('uuid');

module.exports = ({ productRepository }) => ({
    execute: async (body) => {
        try {
            body.product_id = uuidv4();

            const createdProduct = await productRepository.createProduct(body);

            if (createdProduct) {
                console.log("product", JSON.stringify(createdProduct, null, 2));
                return createdProduct;
            }
        } catch (error) {
            console.log('create product - [Error]: ', error);
            throw error;
        }
    }
});
