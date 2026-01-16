const errorFactory = require('../../../domain/error/ErrorFactory');
const moment = require('moment');


module.exports = ({ productRepository, exception, changeBlockedStatusService, validateScheduleOccupanceService, updateCurrentScheduleService }) => ({
    execute: async (body, product_id) => {
        try {

            const query = {
                where: {
                    product_id: product_id
                }
            };

            const productFound = await productRepository.findOneProduct(query);

            if (!productFound) {
                throw exception.notFound(errorFactory([
                    `Any product found with the product_id:${product_id}`,
                    `Any product found with the product_id:${product_id}`
                ]));
            }

            if (productFound.status === EnumProductStatus.DONE || productFound.status === EnumProductStatus.REVIEW) {
                throw exception.forbidden(errorFactory([
                    `You can't update a product that is already done`,
                    `You can't update a product that is already done`
                ]));
            }

            if (isDateOrHourChanged(productFound, body)) {
                const updatedBody = { ...productFound, ...body };
                await productRepository.updateProduct(updatedBody, query);
            } else {
                await changeBlockedStatusService.execute(productFound.date, productFound.schedule, false);
                await validateScheduleOccupanceService.execute({ date: body.date, schedule: body.schedule });
                const updatedBody = { ...productFound, ...body };
                await productRepository.updateProduct(updatedBody, query);


                await updateCurrentScheduleService.execute(null, productFound.user_id, productFound.product_id);
                const currentSchedule = {
                    product_id: updatedBody.product_id,
                    treatment: updatedBody.treatment,
                    date: updatedBody.date,
                    total_value: updatedBody.total_value,
                    status: updatedBody.status
                };
                await updateCurrentScheduleService.execute(currentSchedule, productFound.user_id);
            }

            const newProductFound = await productRepository.findOneProduct(query);
            return newProductFound;

        } catch (error) {
            console.log('updateProduct:', ' - [Error]: ', error);
            throw error;
        }
    }
});

function isDateOrHourChanged(atualProduct, newProduct) {
    const isSameStartHour = atualProduct.schedule.start_hour === newProduct.schedule.start_hour;
    const isSameEndHour = atualProduct.schedule.end_hour === newProduct.schedule.end_hour;
    const isSameStartDate = atualProduct.date == atualProduct.date;

    return isSameStartHour && isSameEndHour && isSameStartDate;
}
