module.exports = ({ generateReportService }) => ({
    execute: async (transactionData) => {
        return await generateReportService.execute(transactionData);
    }
});