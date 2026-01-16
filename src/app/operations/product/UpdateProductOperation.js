module.exports = ({ updateProductService }) => ({
    execute: async (body, product_id) => {
        return await updateProductService.execute(body, product_id);
    }
});