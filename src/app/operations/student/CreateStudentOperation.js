module.exports = ({ createStudentService }) => ({
    execute: async (transactionData, res) => {
        return await createStudentService.execute(transactionData, res);
    }
});