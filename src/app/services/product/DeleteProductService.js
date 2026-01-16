const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ productRepository, exception, changeBlockedStatusService, updateCurrentScheduleService, updateHistoryService  }) => ({
    execute: async (product_id) => {
        try {
            const query = {
                where: { product_id: product_id }
            };

            const productFound = await productRepository.findOneProduct(query);
            await changeBlockedStatusService.execute(productFound.date, productFound.schedule, false);

            await updateCurrentScheduleService.execute(null, productFound.user_id, productFound.product_id);
            const history = {
                date: productFound.date,
                treatment: productFound.treatment,
                total_value: productFound.total_value,
                status: 'deleted'
            };
            await updateHistoryService.execute(history, productFound.user_id);


            if (!productFound) {
                throw exception.notFound(errorFactory([
                    `Any product  found with the product_id ${product_id}`,
                    `Any product  found with the product_id ${product_id}`
                ]));
            } else {
                await productRepository.deleteProduct(productFound);
            }
        } catch (error) {
            console.log('deleteProduct - product:', product_id, ' - [Error]: ', error);
            throw error;
        }
    }
});