module.exports = ({ createProductService }) => ({
    execute: async (transactionData) => {
        const createdProduct = await createProductService.execute(transactionData);
        return createdProduct;
    }
});