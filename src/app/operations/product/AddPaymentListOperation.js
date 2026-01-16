module.exports = ({ addPaymentListService }) => ({
    execute: async (transactionData, product_id,) => {
        const updatedList = await addPaymentListService.execute(transactionData, product_id);
        return updatedList;
    }
});