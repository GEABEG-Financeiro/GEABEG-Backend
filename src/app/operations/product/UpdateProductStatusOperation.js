module.exports = ({ updateProductStatusService}) => ({
    execute: async (body, product_id) => {
        return await updateProductStatusService.execute(body, product_id);
    }
});