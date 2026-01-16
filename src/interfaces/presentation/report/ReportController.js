const AsyncMiddleware = require('../../middlewares/AsyncMiddleware');

module.exports = () => ({

    postReport: AsyncMiddleware(async (ctx) => {
        const { generateReportOperation, httpConstants } = ctx.container.cradle;

        const { body: transactionData } = ctx;

        const reportGenerated = await generateReportOperation.execute(transactionData);

        // Configurar headers para download do PDF
        ctx.res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${reportGenerated.filename}"`,
            'Content-Length': Buffer.from(reportGenerated.pdf, 'base64').length
        });

        return ctx.res.status(httpConstants.OK).send(Buffer.from(reportGenerated.pdf, 'base64'));
    })

});
