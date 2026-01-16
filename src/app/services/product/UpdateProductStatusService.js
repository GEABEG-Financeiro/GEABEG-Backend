const errorFactory = require('../../../domain/error/ErrorFactory');


module.exports = ({ productRepository, exception, updateCurrentScheduleService, updateHistoryService }) => ({
    execute: async (body, product_id) => {
        try {
            const query = {
                where: {
                    product_id: product_id
                }
            };

            const product = await productRepository.findOneProduct(query);

            if (!product) {
                throw exception.notFound(errorFactory([
                    `Any product found with the product_id:${product_id}`,
                    `Any product found with the product_id:${product_id}`
                ]));
            }

            if (product.status === EnumProductStatus.REVIEW) {
                throw exception.forbidden(errorFactory([
                    `You can't update a product that is already reviewed`,
                    `You can't update a product that is already reviewed`
                ]));
            }

            if (body.status === EnumProductStatus.DENIED) {
                if (product.status === EnumProductStatus.SCHEDULED) {
                    const updatedBody = { ...product, ...body };
                    await productRepository.updateProduct(updatedBody, query);
                    await updateCurrentScheduleService.execute(null, product.user_id, product.product_id);
                }
                else {
                    throw exception.forbidden(errorFactory([
                        `You can only denied products there are scheduled`,
                        `You can only denied products there are scheduled`
                    ]));
                }
            }

            if (body.status === EnumProductStatus.APPROVED) {
                if (product.status === EnumProductStatus.SCHEDULED) {
                    const updatedBody = { ...product, ...body };
                    await productRepository.updateProduct(updatedBody, query);
                }
                else {
                    throw exception.forbidden(errorFactory([
                        `You can only aprroved products there are scheduled`,
                        `You can only aprroved products there are scheduled`
                    ]));
                }
            }

            if (body.status === EnumProductStatus.DONE) {
                if (product.status === EnumProductStatus.APPROVED) {
                    const updatedBody = { ...product, ...body };
                    await productRepository.updateProduct(updatedBody, query);
                    const history = {
                        date: product.date,
                        treatment: product.treatment,
                        total_value: product.total_value,
                        status: product.status
                    };
                    await updateHistoryService.execute(history, product.user_id);
                }
                else {
                    throw exception.forbidden(errorFactory([
                        `You can only finish products there are aprroved`,
                        `You can only finish products there are aprroved`
                    ]));
                }
            }

            if (body.status === EnumProductStatus.REVIEW) {
                if (product.status === EnumProductStatus.DONE) {
                    const updatedBody = { ...product, ...body };
                    await productRepository.updateProduct(updatedBody, query);
                    await updateCurrentScheduleService.execute(null, product.user_id, product.product_id);
                }
                else {
                    throw exception.forbidden(errorFactory([
                        `You can only review products there are done`,
                        `You can only review products there are done`
                    ]));
                }
            }

            const newUpdatedProduct = await productRepository.findOneProduct(query);
            return newUpdatedProduct;
            
        } catch (error) {
            console.log('updateProductStatus:', body.status, ' - [Error]: ', error);
            throw error;
        }
    }
});
