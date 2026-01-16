const AsyncMiddleware = require('../../middlewares/AsyncMiddleware');

module.exports = () => ({

    postReport: AsyncMiddleware(async (ctx) => {
        const { generateReportOperation, httpConstants } = ctx.container.cradle;

        const { body: transactionData } = ctx;

        const reportGenerated = await generateReportOperation.execute(transactionData);

        return ctx.res.status(httpConstants.OK).json(reportGenerated);
    })

});
