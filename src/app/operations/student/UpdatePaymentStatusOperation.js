module.exports = ({ updatePaymentStatusService }) => ({
    execute: async (body, student_id, product_id) => {
        return await updatePaymentStatusService.execute(body, student_id, product_id);
    }
});